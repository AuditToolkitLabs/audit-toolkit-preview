#!/usr/bin/env python3
"""
Freshness Validation: Check if local customer-docs match central repository.

Compares file hashes and timestamps between local customer-docs and
central documentation repository to identify stale or out-of-sync files.

Usage:
  python ci/validate-docs-freshness.py [--show-diffs] [--timeout-seconds 30]
"""

import os
import sys
import json
import hashlib
import argparse


def get_file_hash(filepath):
    """Compute SHA256 hash of a file."""
    sha256 = hashlib.sha256()
    try:
        with open(filepath, 'rb') as f:
            for chunk in iter(lambda: f.read(4096), b''):
                sha256.update(chunk)
        return sha256.hexdigest()
    except OSError:
        return None


def load_config(config_path='docs-source-config.json'):
    """Load documentation source configuration."""
    try:
        with open(config_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (OSError, json.JSONDecodeError):
        return {}


def collect_local_docs(local_root='customer-docs'):
    """Collect all files in local customer-docs directory."""
    local_files = {}
    try:
        for root, _, files in os.walk(local_root):
            for file in files:
                if file.startswith('.'):
                    continue
                filepath = os.path.join(root, file)
                rel_path = os.path.relpath(filepath, local_root)
                try:
                    stat = os.stat(filepath)
                    local_files[rel_path] = {
                        'path': filepath,
                        'size': stat.st_size,
                        'mtime': stat.st_mtime,
                        'hash': get_file_hash(filepath)
                    }
                except OSError as err:
                    print(f"  Warning: Could not stat {filepath}: {err}",
                          file=sys.stderr)
    except OSError as err:
        print(f"Error scanning local docs: {err}", file=sys.stderr)
    return local_files


def collect_central_docs(central_path):
    """Collect all files in central documentation repository."""
    central_files = {}
    if not os.path.isdir(central_path):
        print(f"Central repo not found: {central_path}", file=sys.stderr)
        return central_files

    try:
        for root, _, files in os.walk(central_path):
            for file in files:
                if file.startswith('.'):
                    continue
                filepath = os.path.join(root, file)
                rel_path = os.path.relpath(filepath, central_path)
                try:
                    stat = os.stat(filepath)
                    central_files[rel_path] = {
                        'path': filepath,
                        'size': stat.st_size,
                        'mtime': stat.st_mtime,
                        'hash': get_file_hash(filepath)
                    }
                except OSError as err:
                    print(f"  Warning: Could not stat {filepath}: {err}",
                          file=sys.stderr)
    except OSError as err:
        print(f"Error scanning central docs: {err}", file=sys.stderr)
    return central_files


def compare_docs(local_files, central_files):
    """Compare local and central documentation files."""
    results = {
        'total_local': len(local_files),
        'total_central': len(central_files),
        'fresh': [],
        'modified': [],
        'missing_in_central': [],
        'missing_in_local': [],
        'hash_mismatch': []
    }

    # Check each local file
    for rel_path, local_info in local_files.items():
        if rel_path not in central_files:
            results['missing_in_central'].append(rel_path)
            continue

        central_info = central_files[rel_path]

        # Compare file hashes
        if local_info['hash'] and central_info['hash']:
            if local_info['hash'] == central_info['hash']:
                results['fresh'].append(rel_path)
            else:
                results['hash_mismatch'].append({
                    'file': rel_path,
                    'local_hash': local_info['hash'],
                    'central_hash': central_info['hash'],
                    'local_mtime': local_info['mtime'],
                    'central_mtime': central_info['mtime']
                })

    # Check for files in central but missing locally
    for rel_path in central_files:
        if rel_path not in local_files:
            results['missing_in_local'].append(rel_path)

    return results


def print_results(results, show_diffs=False):
    """Print freshness validation results."""
    print("\n=== Documentation Freshness Validation ===\n")

    print(f"Local docs:   {results['total_local']} files")
    print(f"Central docs: {results['total_central']} files")
    print(f"Fresh:        {len(results['fresh'])} files")
    print(f"Mismatches:   {len(results['hash_mismatch'])} files")
    print(f"Missing in central: {len(results['missing_in_central'])} files")
    print(f"Missing in local:   {len(results['missing_in_local'])} files")

    if results['hash_mismatch']:
        print("\n⚠️  Hash mismatches detected:")
        for mismatch in results['hash_mismatch'][:10]:
            print(f"  {mismatch['file']}")
            if show_diffs:
                print(f"    Local hash:   {mismatch['local_hash'][:16]}...")
                print(f"    Central hash: {mismatch['central_hash'][:16]}...")

    if results['missing_in_central']:
        print("\n⚠️  Files in local but not in central:")
        for file in results['missing_in_central'][:5]:
            print(f"  {file}")
        if len(results['missing_in_central']) > 5:
            extra = len(results['missing_in_central']) - 5
            print(f"  ... and {extra} more")

    if results['missing_in_local']:
        print("\n⚠️  Files in central but not in local:")
        for file in results['missing_in_local'][:5]:
            print(f"  {file}")
        if len(results['missing_in_local']) > 5:
            extra = len(results['missing_in_local']) - 5
            print(f"  ... and {extra} more")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Validate freshness of local vs central documentation'
    )
    parser.add_argument('--show-diffs', action='store_true',
                        help='Show detailed diff information')
    parser.add_argument('--timeout-seconds', type=int, default=30,
                        help='Operation timeout (not strictly enforced)')

    args = parser.parse_args()

    # Load configuration
    config = load_config()
    central_path = config.get('centralDocsRepositoryPath')

    if not central_path or not os.path.isdir(central_path):
        print("⚠️  Central repository not available or not configured")
        print("   Freshness validation skipped")
        return 0

    # Collect files
    print("Scanning local documentation...")
    local_files = collect_local_docs()
    print(f"  Found {len(local_files)} files")

    print("Scanning central documentation...")
    central_files = collect_central_docs(central_path)
    print(f"  Found {len(central_files)} files")

    # Compare
    print("Comparing files...")
    results = compare_docs(local_files, central_files)

    # Print results
    print_results(results, args.show_diffs)

    # Determine exit code
    if results['hash_mismatch'] or results['missing_in_local']:
        print("\n❌ Docs sync status: OUT OF SYNC")
        return 1
    elif results['missing_in_central']:
        print("\n⚠️  Docs sync status: DIVERGED")
        return 0
    else:
        print("\n✅ Docs sync status: FRESH")
        return 0


if __name__ == '__main__':
    sys.exit(main())
