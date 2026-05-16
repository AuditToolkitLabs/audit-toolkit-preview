# Discovery Playbooks

Ansible playbooks in this folder support legacy-compatible discovery
execution.

## Supported Playbooks

- snmp-v2c-discovery.yml
- snmp-v3-discovery.yml
- ssh-discovery.yml

## Intended Use

- Run playbooks in controlled operator workflows
- Feed normalized output into ansible-unified connector jobs
- Keep credentials out of API payloads when possible

## Minimal Example

snmp v2c:

- ansible-playbook playbooks/discovery/snmp-v2c-discovery.yml -e
  target_host=10.0.1.100 -e snmp_community=public

ssh:

- ansible-playbook playbooks/discovery/ssh-discovery.yml -e
  target_host=10.1.1.5 -e ssh_user=netops

## Notes

- These playbooks are discovery-only and should remain non-destructive
- Output should be used for inventory and reporting alignment, not direct
  remediation actions
