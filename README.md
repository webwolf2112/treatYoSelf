# treatYoSelf


Ansible instructions:
* untar the archive (gluecon-team5-ansible.tar.gz)
* `cd gluecon-team5`
* `virtualenv .`
* `source bin/activate` (or, if you're on Windows with Cygwin: `source Scripts/activate`)
* `pip install -r requirements.txt`
* `BOTO_CONFIG=boto.cfg ansible-playbook -vvv playbook.yml`