# Third-Party Software Notices

**Product**: Security Audit Toolkit
**Copyright**: © 2026 Security Audit Toolkit Project

This product includes or depends upon the following third-party software.
Each component is used under the terms of its listed licence.

---

## Python runtime dependencies

| Package | Licence | Notes |
| --- | --- | --- |
| Flask | BSD 3-Clause | Web application framework |
| SQLAlchemy | MIT | ORM and database abstraction |
| Alembic | MIT | Database migration tool |
| Celery | BSD 3-Clause | Distributed task queue |
| Redis (redis-py) | MIT | Redis client library |
| cryptography | Apache 2.0 / BSD | Fernet encryption, TLS |
| bcrypt | Apache 2.0 | Password hashing |
| paramiko | LGPL 2.1 | SSH client for Linux audit targets |
| pywinrm | MIT | WinRM client for Windows audit targets |
| Jinja2 | BSD 3-Clause | Template engine |
| Werkzeug | BSD 3-Clause | WSGI utilities |
| gunicorn | MIT | WSGI HTTP server |
| psycopg2 | LGPL 3.0 | PostgreSQL adapter |
| pyOpenSSL | Apache 2.0 | OpenSSL bindings |
| ldap3 | LGPL 3.0 | LDAP / Active Directory integration |
| PyYAML | MIT | YAML parsing |
| requests | Apache 2.0 | HTTP client |
| marshmallow | MIT | Object serialisation |
| click | BSD 3-Clause | CLI utilities |
| python-dotenv | BSD 3-Clause | `.env` file loading |
| Pillow | HPND | Image processing (report generation) |
| WeasyPrint | BSD 3-Clause | PDF report generation |
| oauthlib | BSD 3-Clause | OAuth 2.0 support |
| itsdangerous | BSD 3-Clause | Secure token signing |

Full dependency trees and pinned versions are in `requirements.txt`
and `requirements-dev.txt` at the repository root.

---

## JavaScript / front-end dependencies

| Package | Licence | Notes |
| --- | --- | --- |
| Bootstrap | MIT | UI component library |
| Chart.js | MIT | Audit score charts |
| htmx | BSD 2-Clause | Dynamic HTML interactions |
| Alpine.js | MIT | Reactive front-end sprinkles |
| DataTables | MIT | Sortable/filterable HTML tables |

---

## Infrastructure / runtime dependencies

| Component | Licence | Notes |
| --- | --- | --- |
| PostgreSQL | PostgreSQL Licence (BSD-like) | Recommended production database |
| Redis | BSD 3-Clause | Celery broker |
| Nginx | BSD 2-Clause | Recommended reverse proxy |
| OpenJDK (for agent) | GPL 2.0 with Classpath Exception | JRE standalone / managed agent runtime |

---

## Shell and system tools (audit scripts)

The Linux audit scripts use standard POSIX and GNU utilities
(`bash`, `awk`, `grep`, `sed`, `systemctl`, `ss`, `find`, `stat`, etc.)
which are typically licenced under GPL 2.0 or GPL 3.0 as part of the
GNU Core Utilities and util-linux packages. These tools are used as
external processes and are not distributed with or linked to this
software.

---

## Notices

Copies of the full licence texts for the above components are
available at:

- <https://opensource.org/licenses/> (for OSI-approved licences)
- The respective project repositories listed in `requirements.txt`

Where required by the LGPL, object files or instructions for
relinking can be provided on request to
[admin@audittoolkitlabs.com](mailto:admin@audittoolkitlabs.com).

---

## MIT Licence (for MIT-licenced components above)

```text
Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
