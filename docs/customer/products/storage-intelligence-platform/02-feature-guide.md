# File Classification

## Overview

Every file the agent processes is classified into a **category** and **sub-type**
using a two-stage approach:

1. **Extension lookup** — 379 built-in extensions mapped to `(category, sub_type)`.
   Custom extensions added via the Admin UI are merged over this map.
2. **Magic byte probe** — binary files with unrecognised extensions are probed
   against 21 known binary signatures (HDF5, NetCDF, FITS, DICOM, PDF, ELF,
   ZIP, GZIP, QCOW2, etc.) and classified from their actual content.

Classification appears in every inventory record as `classification`:

```json
{
  "path": "/data/experiment.h5",
  "classification": "Data/HDF5",
  "tags": ["high_value", "research_data"],
  ...
}
```

---

## Categories

The classifier uses 17 top-level categories. Custom extensions should use these
where possible so the dashboard charts group correctly.

| Category | Description | Example sub-types |
| --- | --- | --- |
| `Scripts` | Interpreted and compiled-language source code | Python, Bash, PowerShell, Rust, Go, TypeScript |
| `Configuration` | System and application config | YAML, INI, TOML, Terraform HCL, Ansible, Kubernetes |
| `Documentation` | Markup and formatted text | Markdown, LaTeX, reStructuredText, Org |
| `Data` | General-purpose structured data | CSV, JSON, HDF5, NetCDF, Parquet, Feather |
| `Database` | Database engine files | SQLite, PostgreSQL dump, MySQL dump |
| `Scientific` | Domain-specific scientific formats | FITS, GRIB, ROOT, GROMACS, VASP, Gaussian, Amber |
| `Genomics` | Bioinformatics / sequencing data | FASTA, FASTQ, BAM, CRAM, VCF, BCF, GTF, PLINK, Fast5 |
| `Medical` | Medical imaging and electrophysiology | DICOM, NIfTI, MINC, FreeSurfer, EDF, BrainVision, NWB |
| `Documents` | Office and publication formats | PDF, Word, PowerPoint, OpenDocument, EPUB |
| `Media` | Images, audio, and video | JPEG, PNG, MP4, MKV, WAV, FLAC, MIDI |
| `Security` | Credentials and cryptographic material | PEM, X.509, PKCS12, GnuPG, SSH keys |
| `Executables` | Compiled binaries and packages | ELF, PE/DLL, JAR, WASM, Python wheel |
| `Archives` | Compressed and packaged files | ZIP, TAR, GZIP, BZIP2, 7ZIP, RAR, DEB, RPM |
| `DiskImage` | Virtual machine and disk images | ISO, QCOW2, VMDK, VHD/VHDX, OVA |
| `Backup` | Backup and temporary files | BAK, DUMP, SWP, TMP, ORIG |
| `Logs` | Log files | LOG, SYSLOG, WTMP, journal, Apache access log |
| `Fonts` | Font files | TTF, OTF, WOFF, WOFF2 |

---

## Tag system

The classifier attaches tags to each record for fast filtering without joining
on category strings. Tags are additive — a file can carry multiple.

| Tag | Applied when |
| --- | --- |
| `high_value` | Extension is in the high-value set (scripts, certs, HDF5, ML models, genomics, etc.) |
| `script` | Interpreted script (shell, Python, Ruby, Perl, Julia, AWK, etc.) |
| `sensitive` | Private key, certificate, or credential file |
| `config` | Category is `Configuration` |
| `research_data` | HDF5, NetCDF, FITS, ROOT, GRIB, MATLAB, R data, Jupyter notebooks |
| `bioinformatics` | Genomics category (FASTA, FASTQ, BAM, VCF, etc.) |
| `medical_imaging` | DICOM, NIfTI, FreeSurfer, MINC, MRC/CCP4 |
| `executable` | Category is `Executables` |
| `disk_image` | Category is `DiskImage` |
| `notebook` | Jupyter notebook (`.ipynb`) |
| `targeted_match` | Extension appeared in `scan_policy.extension_filter` for this scan |
| `new_file_type` | Extension not in any known map (tier = `full_metadata`) |
| `parse_failed` | Structured extractor failed to read the file header |
| `ignored_large_object` | File exceeded `max_file_size_bytes` |

Query by tag via the API:

```http
GET /inventory?tag=targeted_match
GET /inventory?tag=bioinformatics
```

---

## Structured extraction (tier: full_metadata)

Files in the `full_metadata` tier receive lightweight header extraction that
populates additional metadata fields:

| Format | Fields extracted |
| --- | --- |
| Shell / Python / R scripts | `shebang` (first `#!` line) |
| JSON | `json_root_type`, `json_top_keys` |
| Jupyter notebooks | `notebook_kernel`, `notebook_language`, `notebook_cell_count` |
| YAML | `yaml_top_keys` |
| INI / CFG / CONF | `ini_sections` |
| TOML | `toml_sections`, `toml_top_keys` |
| PEM / key / cert | `credential_type` (e.g. `PRIVATE KEY`, `CERTIFICATE`) |
| LaTeX | `latex_documentclass`, `latex_title` |
| FASTA | `fasta_first_id`, `fasta_sequence_type` (nucleotide/protein) |
| FASTQ | `fastq_first_id` |
| Fortran namelist | `namelist_groups` |
| Binary (magic probe) | `magic_category`, `magic_subtype`, `magic_confirmed: true` |

---

## Binary magic byte signatures

Files that do not match any extension are probed against these signatures.
A match overrides the extension-based classification.

| Format | Magic bytes (hex) | Offset |
| --- | --- | --- |
| HDF5 | `89 48 44 46 0D 0A 1A 0A` | 0 |
| NetCDF (classic/64-bit) | `43 44 46 01` / `43 44 46 02` | 0 |
| FITS | `53 49 4D 50 4C 45 20 20 3D` | 0 |
| GRIB | `47 52 49 42` | 0 |
| ROOT (CERN) | `72 6F 6F 74` | 0 |
| BAM (binary alignment) | `42 41 4D 01` | 0 |
| DICOM | `44 49 43 4D` | 128 |
| PDF | `25 50 44 46 2D` | 0 |
| ELF (Linux executable) | `7F 45 4C 46` | 0 |
| PE/DLL (Windows) | `4D 5A` | 0 |
| GZIP | `1F 8B` | 0 |
| BZIP2 | `42 5A 68` | 0 |
| ZIP | `50 4B 03 04` | 0 |
| 7-ZIP | `37 7A BC AF 27 1C` | 0 |
| Zstandard | `28 B5 2F FD` | 0 |
| LZ4 | `04 22 4D 18` | 0 |
| XZ | `FD 37 7A 58 5A 00` | 0 |
| RAR | `52 61 72 21 1A 07` | 0 |
| QCOW2 (VM disk) | `51 46 49 FB` | 0 |
| VMDK (VM disk) | `4B 44 4D 56` | 0 |

---

## Research and HPC coverage

The classifier is designed for university and HPC environments with specialised
file types.

### Scientific

| Sub-type | Extension(s) | Notes |
| --- | --- | --- |
| FITS | `.fits .fit .fts` | Astronomical imaging (magic bytes also detected) |
| GRIB | `.grib .grb .grb2 .grib2` | Meteorological data |
| ROOT | `.root` | CERN particle physics analysis framework |
| HDF5 | `.hdf5 .h5 .he5 .hdf` | Generic hierarchical data (also magic-detected) |
| NetCDF | `.nc .nc4 .cdf` | Climate and oceanographic data (also magic-detected) |
| MATLAB | `.mat` | MATLAB workspace files |
| GROMACS | `.gro .xtc .trr .tpr .edr` | Molecular dynamics trajectories |
| VASP | `POSCAR CONTCAR OUTCAR XDATCAR` | DFT electronic structure |
| Gaussian | `.gjf .gjc .com .fchk .log` | Quantum chemistry calculations |
| Amber | `.prmtop .inpcrd .mdcrd .nc` | MD force field topology |
| LAMMPS | `.lmp .lammpstrj .data` | MD simulation files |

### Genomics

| Sub-type | Extension(s) | Notes |
| --- | --- | --- |
| FASTA | `.fasta .fa .fna .ffn .faa .frn` | Nucleotide and protein sequences |
| FASTQ | `.fastq .fq` | Sequencing reads with quality scores |
| BAM/SAM | `.bam .sam` | Aligned reads (BAM also magic-detected) |
| CRAM | `.cram` | Reference-compressed alignment |
| VCF/BCF | `.vcf .bcf` | Variant call format |
| GTF/GFF | `.gtf .gff .gff3` | Gene feature annotations |
| BED | `.bed .bedgraph .bigbed .bigwig .bw .wig` | Genomic intervals |
| PLINK | `.ped .fam .bim` | Genotype array data |
| Fast5/POD5 | `.fast5 .pod5` | Oxford Nanopore raw signal |

### Medical

| Sub-type | Extension(s) | Notes |
| --- | --- | --- |
| DICOM | `.dcm .ima` | Standard medical imaging (magic-detected at offset 128) |
| NIfTI | `.nii` | Neuroimaging (fMRI, structural MRI, DTI) |
| FreeSurfer | `.mgh .mgz` | Cortical surface and volume data |
| MINC | `.mnc` | Multi-dimensional neuroimaging |
| MRC/CCP4 | `.mrc .rec .mrcs .ccp4` | Cryo-EM density maps |
| EDF/BDF | `.edf .bdf` | EEG/polysomnography (European data format) |
| EEGLAB | `.set .fdt` | EEGLAB MATLAB-format EEG datasets |
| BrainVision | `.vhdr .vmrk .eeg` | BrainProducts amplifier format |
| NWB | `.nwb` | Neurodata Without Borders (HDF5-based) |

### Machine learning

| Sub-type | Extension(s) | Notes |
| --- | --- | --- |
| PyTorch | `.pt .pth` | Model checkpoints and tensors |
| ONNX | `.onnx` | Cross-framework model exchange |
| SafeTensors | `.safetensors` | Memory-safe model serialisation |
| Keras/TF | `.h5 .keras .tflite` | Keras and TFLite models |
| XGBoost/LightGBM | `.model .bin` (sub-type dependent) | Gradient boosting models |
| Pickle | `.pkl .pickle` | Serialised Python ML objects |
| Joblib | `.joblib` | Scikit-learn model persistence |

---

## Custom file type registry

When the built-in map does not cover a format, administrators can add custom
entries via **Admin → Settings → Custom File Type Registry**.

### Adding via the UI

1. Open **Admin → Settings**.
2. Scroll to **Custom File Type Registry**.
3. Click **Add Extension**, fill in Extension / Category / Sub-type, click **Save**.

Custom entries take effect on the next agent scan.

### Injecting via agent YAML

For air-gapped deployments where the agent cannot reach the server registry:

```yaml
scan_policy:
  custom_file_types:
    .mydata: [Scientific, LabView]
    .xyz:    [Genomics, XYZFormat]
```

YAML-injected types are merged at agent startup. Server-side registry entries
are fetched when the scan job payload is delivered.

### Via the API

```http
POST /admin/file-types/custom
Content-Type: application/json

{
  "extension": ".mydata",
  "category": "Scientific",
  "sub_type": "LabView",
  "description": "National Instruments LabView project"
}
```

The full CRUD endpoint set for custom file types is documented in the platform
API reference.

### Override behaviour

Custom entries **override** built-in entries for the same extension. Use this
to re-categorise a built-in type (e.g. reclassify `.log` from `Logs` to a
custom `Audit` category).

---

## Unknown file types

Files whose extension does not match any entry (built-in or custom) are
classified as `Unknown/Unknown`. If the file is in the `full_metadata` tier,
the magic byte probe runs and may produce a specific classification. If the
probe also finds nothing, the file is tagged `new_file_type`.

Use `new_file_type` tagged records to discover formats you may want to add to
the custom registry:

```http
GET /inventory?tag=new_file_type
```

This workflow is the intended path for building up organisation-specific
coverage over time.
