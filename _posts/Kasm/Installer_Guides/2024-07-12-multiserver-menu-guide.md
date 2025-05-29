---
layout: post
title: Kasm Multi-Server Installer Guide
description: This section below is the installation and menu guide for the Kasm multiserver installer.
type: ccc
courses: {}
menu: nav/kasm_cloud.html
toc: true
comments: true
permalink: /kasm/multiserver/install
---

## Initialization Guide

### Setup

Clone the repository to your computer with the following command:

```sh
git clone https://github.com/open-coding-society/kasm-multi-server.git
```

### Prerequisites

For a Windows system, Windows Subsystem for Linux must be installed, preferrably with Ubuntu, however, MacOS Homebrew, apt, yum, and snap are all supported package managers.

The following packages must be installed on the system:

- ansible
- jq
- awscli (must be configured)

The script `install_dependencies.sh` goes through the installation process, however, you must make sure awscli is configured accordig to your user. You may also run the script manually to install dependences:

```sh
chmod +x install_dependencies && ./install_dependencies.sh
```

Secondly, the Kasm installer needs to be downloaded and placed in the right location. Navigate to [https://www.kasmweb.com/downloads.html](https://www.kasmweb.com/downloads.html) and download the latest version as a `tar.gz` (when you click download, that should be the format it is already in). Make sure the name has no additions to it by the operating system. Finally, place the `tar.gz` file in the directory `roles/install_common/files/kasm_release_{version}.tar.gz`.

### Dashboard

The script is now ready to run. You may run the command `chmod +x *.sh` in the root directory of the project and then run `main.sh`, or you may run the following command (preferred):

```sh
chmod +x main.sh && ./main.sh
```

The script will first check for the prerequisite dependencies, and will then initialize the dashboard, which will give the menu options:

```text
Menu
1. Install Kasm (run launch.sh)
2. Install Kasm Images on Prewritten Inventory
3. Start Kasm
4. Stop Kasm
5. Restart Kasm
6. Update Kasm
7. Uninstall Kasm
8. Uninstall Kasm and Delete the Instances
9. Exit
```

These menu options will be discussed as the guide continues. For now, note that only the number should be put in the input field (no extra spaces behind or ahead), and #9 is to exit.

## (1) Installation of Multi-Server

Installing Kasm from scratch means that there are no pre-existing servers. Therefore, the script can do its job without having to worry about the inventory. If you have pre-existing servers, read the inventory_directory to configure the inventory to work with your servers, and make sure you allow your configured ports access to your servers. During the installation, `.txt` files will appear. It is recommended that they stay on the system, as some parts of the system may use them even after installation.

To install from scratch, we initialize the main script:

```sh
chmod +x main.sh && ./main.sh
```

We then select `1` on the menu, which double checks for the dependencies before installation, and will then proceed to ask for some variables, which are outlined in order in the table below.

Here is the completed table:

| Variable               | Question                                            | Expected Responses                                                                                                                                                                                         |
|------------------------|-----------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Region                 | Enter AWS region                                    | This question expects the response of an AWS region, such as "us-west-1" so it can determine the AMI to use for Ubuntu 22.04. The accepted regions are "us-west-1", "us-west-2", "us-east-1", "us-east-2". |
| # Agent Servers        | Enter the number of agent servers (default 1)       | This question asks for the number of Kasm agent servers you would like to add. This expects a numerical argument, such as "3". The default (press ENTER) is "1".                                           |
| Agent Server Processor | Enter the size of agent servers (default t3.medium) | Asks for processing size of agent server, which is the type of processor selected in AWS. This has a default (press ENTER) of t3.medium, and accepts arguments similar to it.                              |
| Other Server Processor | Enter the size of other servers (DB, Guac, Web)     | Asks for the processing size of other servers, such as the DB, Guac, and Web servers. This has a default (press ENTER) of t3.medium, and accepts arguments similar to it.                                  |
| Agent Server Disk Size | Enter the disk size of agent servers in GB (default 50) | Asks for the disk size in GB of the agent servers. This has a default (press ENTER) of 50 GB, and accepts numerical arguments similar to it.                                                                |
| Other Server Disk Size | Enter the disk size of other servers (DB, Guac, Web) in GB (default 50) | Asks for the disk size in GB of the other servers, such as DB, Guac, and Web servers. This has a default (press ENTER) of 50 GB, and accepts numerical arguments similar to it.                              |
| Custom AMI ID          | Enter custom AMI ID if region-specific AMI is not available (leave blank if not needed) | Asks for a custom AMI ID if the region-specific AMI is not available. This field can be left blank if not needed.                                                                                           |

The system will then create the requested amount of images, with the web image having an elastic IP associated with it. After, the system will SSH to each instance and install `docker`. Then, it will proceed to installing the Kasm docker images onto the system. However, it will first ask for the passwords it should initialize the system with. The table of passwords is shown below:

| Variable             | Question                                               | Expected Responses                                                                                                                                                                              |
|----------------------|--------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Kasm User Password   | Enter user password [default: password]                | Asks the user for the local kasm user's (<user@kasm.local>) password, and has a default (press ENTER) password of "password".                                                                     |
| Admin Password       | Enter admin password [default: adminpassword]          | Asks the user for the admin user's password, and has a default (press ENTER) password of "adminpassword".                                                                                       |
| DB Password          | Enter database password [default: dbpassword]          | Asks the user for the database user's password, and has a default (press ENTER) password of "dbpassword".                                                                                       |
| Redis Password       | Enter Redis password [default: redispassword]          | Asks the user for the Redis user's password, and has a default (press ENTER) password of "redispassword".                                                                                       |
| Manager Token        | Enter manager token [default: managertoken]            | Asks the user for the manager token, and has a default (press ENTER) token of "managertoken".                                                                                                   |
| Registration Token   | Enter registration token [default: registrationtoken]  | Asks the user for the registration token, and has a default (press ENTER) token of "registrationtoken".                                                                                         |

These passwords should be stored somewhere safe, as you will need them to log onto and maintain the system. These passwords can be recovered from the inventory file in case.

After setting the passwords, the system will begin the multi-server installation of the Kasm system.

Once the system is finished, it will be complete with the installation. You can now access your Kasm multi-server instance at `https://{your-web-ip}`, which can be found by the command:

```sh
cat web_server_ip.txt
```

### If blocked, click on Advanced and then Proceed to the Connection to access the system

## (2) Installation of Kasm on Prewritten Inventory

To just install the Kasm Docker images, you can manually edit the `inventory` file using the inventory instructions located in `inventory_directory`, where each comment or variable name explains how to configure the system.

### Manual Multi-Server

To manually add multiple parts, all you must do is change the integers and add new blocks to the configuration, similar to this:

```yml
        zone1_web:
          hosts:
            zone1_web_1:
              ansible_host: zone1_web_hostname
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: ~/.ssh/id_rsa
            zone1_web_2:
              ansible_host: zone1_web2_hostname
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: ~/.ssh/id_rsa
        zone1_agent:
          hosts:
            zone1_agent_1:
              ansible_host: zone1_agent_hostname
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: ~/.ssh/id_rsa
            zone1_agent_2:
              ansible_host: zone1_agent2_hostname
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: ~/.ssh/id_rsa
        zone1_guac:
          hosts:
            zone1_guac_1:
              ansible_host: zone1_guac_hostname
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: ~/.ssh/id_rsa
          hosts:
            zone1_guac_2:
              ansible_host: zone1_guac2_hostname
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: ~/.ssh/id_rsa
```

This can be done for `web`, `agent`, and `guac`, but `db` is not supported as of this time.

### Deploying with a remote database

In order to deploy with a dedicated remote database that is not managed by ansible you will need to provide endpoint and authentication credentials. To properly init the database superuser credentials along with the credentials the application will use to access it will need to be defined.

#### First remove the `zone1_db` entry from inventory

```yaml
        #zone1_db:
          #hosts:
            #zone1_db_1:
              #ansible_host: zone1_db_hostname
              #ansible_port: 22
              #ansible_ssh_user: ubuntu
              #ansible_ssh_private_key_file: ~/.ssh/id_rsa
```

#### Set the relevant credentials and enpoints

```yaml
    ## PostgreSQL settings ##
    ##############################################
    # PostgreSQL remote DB connection parameters #
    ##############################################
    # The following parameters need to be set only once on database initialization
    init_remote_db: true
    database_master_user: postgres
    database_master_password: PASSWORD
    database_hostname: DATABASE_HOSTNAME
    # The remaining variables can be modified to suite your needs or left as is in a normal deployment
    database_user: kasmapp
    database_name: kasm
    database_port: 5432
    database_ssl: true
    ## redis settings ##
    # redis connection parameters if hostname is set the web role will use a remote redis server
    redis_hostname: REDIS_HOSTNAME
    redis_password: REDIS_PASSWORD
```

#### Run the deployment

Option 2 on the Menu or `ansible-playbook -i inventory install_kasm.yml`

**Post deployment if the `install_kasm.yml` needs to be run again to make scaling changes it is important to set `init_remote_db: false` this should happen automatically but best to check**

### Deploying a Dedicated Kasm Proxy

#### Before deployment or while scaling open `inventory` and uncomment/add the relevant lines for :

```yaml
        # Optional Web Proxy server
        #zone1_proxy:
          #hosts:
            #zone1_proxy_1:
              #ansible_host: zone1_proxy_hostname
              #ansible_port: 22
              #ansible_ssh_user: ubuntu
              #ansible_ssh_private_key_file: ~/.ssh/id_rsa
```

#### Post deployment follow the instructions [here](https://www.kasmweb.com/docs/latest/install/multi_server_install/multi_installation_proxy.html#post-install-configuration) to configure the proxy for use.

**It is important to use a DNS endpoint for the `web` and `proxy` role as during deployment the CORS settings will be linked to that domain**

## (3) Start Kasm

If the Kasm network was stopped before, or is inactive, you may start it with option 3.

For more specific start commands:

Start Kasm Workspaces (start_kasm.yml)- This will start all hosts defined in inventory or optionally be limited to a zone, group or single server passing the `--limit` flag. Example Usage `ansible-playbook -i inventory --limit zone1_agent_1 start_kasm.yml`

## (4) Stop Kasm

To stop the Kasm network, and take it offline, you may do so with option 4.

For more specific stop commands:

Stop Kasm Workspaces (stop_kasm.yml)- This will stop all hosts defined in inventory or optionally be limited to a zone, group or single server passing the `--limit` flag. Example Usage `ansible-playbook -i inventory --limit zone1_agent_1 stop_kasm.yml`

## (5) Restart Kasm

To stop the Kasm network, and take it offline, you may do so with option 4.

For more specific restart commands:

Restart Kasm Workspaces (restart_kasm.yml)- This will restart all hosts defined in inventory or optionally be limited to a zone, group or single server passing the `--limit` flag. Example Usage `ansible-playbook -i inventory --limit zone1_agent_1 restart_kasm.yml`

## (6) Update Kasm

This will update the Kasm framework on the hosts using the install feature.

### Scaling the deployment

The installation can be "scaled up" after being installed by adding any additional hosts including entire new zones. Once modified run:

Option 2 on the Menu or `ansible-playbook -i inventory install_kasm.yml`

Before running the installation against a modified inventory file please ensure the credentials lines in your inventory were set and uncommented properly by the initial deployment IE. If installed through the menu, they should already be replaced.

```yaml
    ## Credentials ##
    # If left commented secure passwords will be generated during the installation and substituted in upon completion
    user_password: PASSWORD
    admin_password: PASSWORD
    database_password: PASSWORD
    redis_password: PASSWORD
    manager_token: PASSWORD
    registration_token: PASSWORD
```

#### Scaling examples

A common example of adding more Docker Agents:

```yaml
        zone1_agent:
          hosts:
            zone1_agent_1:
              ansible_host: zone1_agent_hostname
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: ~/.ssh/id_rsa
            zone1_agent_2:
              ansible_host: zone1_agent2_hostname
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: ~/.ssh/id_rsa
```

If you would like to scale up web/agent/guac/proxy servers as a group where the agent/guac/proxy server talk exclusively to that web server set `default_web: false` in your inventory file. This requires entries with a matching integer for all hosts IE:

```yaml
        zone1_web:
          hosts:
            zone1_web_1:
              ansible_host: zone1_web_hostname
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: ~/.ssh/id_rsa
            zone1_web_2:
              ansible_host: zone1_web2_hostname
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: ~/.ssh/id_rsa
        zone1_agent:
          hosts:
            zone1_agent_1:
              ansible_host: zone1_agent_hostname
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: ~/.ssh/id_rsa
            zone1_agent_2:
              ansible_host: zone1_agent2_hostname
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: ~/.ssh/id_rsa
        zone1_guac:
          hosts:
            zone1_guac_1:
              ansible_host: zone1_guac_hostname
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: ~/.ssh/id_rsa
          hosts:
            zone1_guac_2:
              ansible_host: zone1_guac2_hostname
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: ~/.ssh/id_rsa
```

Included in inventory is a commeted section laying out a second zone. The names zone1 and zone2 were chosen arbitraily and can be modified to suite your needs, but all items need to follow that naming pattern IE:

```yaml
    # Second zone
    # Optionally modify names to reference zone location IE west
    west:
      children:
        west_web:
          hosts:
            west_web_1:
              ansible_host: HOST_OR_IP
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: ~/.ssh/id_rsa
        west_agent:
          hosts:
            west_agent_1:
              ansible_host: HOST_OR_IP
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: ~/.ssh/id_rsa
        west_guac:
          hosts:
            west_guac_1:
              ansible_host: HOST_OR_IP
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: ~/.ssh/id_rsa

  vars:
    zones:
      - zone1
      - west
```

#### Missing credentials

If for any reason you have misplaced your inventory file post installation credentials for the installation can be recovered using:

- Existing Database password can be obtained by logging into a webapp host and running the following command:

```bash
sudo grep " password" /opt/kasm/current/conf/app/api.app.config.yaml
```

- Existing Redis password can be obtained by logging into a webapp host and running the following command:

```bash
sudo grep "redis_password" /opt/kasm/current/conf/app/api.app.config.yaml
```

- Existing Manager token can be obtained by logging into an agent host and running the following command:

```bash
sudo grep "token" /opt/kasm/current/conf/app/agent.app.config.yaml
```

## (7) Uninstall Kasm

Uninstalls the Kasm workspace off of the images, but leaves the images intact.

## (8) Uninstall Kasm and Delete the Instances

Uninstalles the Kasm workspaces and deletes the instances.

## EXTRA Commands/All Helper Playbooks

- Uninstall Kasm Workspaces (uninstall_kasm.yml)- This will completely purge your Kasm Workspaces installation on all hosts, if using a remote database that data will stay intact no remote queries will be executed. Example Usage: `ansible-playbook -i inventory uninstall_kasm.yml`
- Stop Kasm Workspaces (stop_kasm.yml)- This will stop all hosts defined in inventory or optionally be limited to a zone, group or single server passing the `--limit` flag. Example Usage `ansible-playbook -i inventory --limit zone1_agent_1 stop_kasm.yml`
- Start Kasm Workspaces (start_kasm.yml)- This will start all hosts defined in inventory or optionally be limited to a zone, group or single server passing the `--limit` flag. Example Usage `ansible-playbook -i inventory --limit zone1_agent_1 start_kasm.yml`
- Restart Kasm Workspaces (restart_kasm.yml)- This will restart all hosts defined in inventory or optionally be limited to a zone, group or single server passing the `--limit` flag. Example Usage `ansible-playbook -i inventory --limit zone1_agent_1 restart_kasm.yml`
- Backup Database (backup_db.yml)- This will make a backup of a managed Docker based db server, this playbook will not function with a remote db type installation. Example Usage ``ansible-playbook -i inventory backup_db.yml`
  - Modify `remote_backup_dir` in inventory to change the path the remote server stores the backups
  - Modify `retention_days` in inventory to change the number of days that logs backups are retained on db host
  - Set `local_backup_dir` to define a path on the local ansible host where backups will be stored, if unset backups will only exist on the remote server
- OS Patching (patch_os.yml)- This will update system packages and reboot on all hosts defined in inventory or optionally be limited to a zone, group or single server passing the `--limit` flag. Example Usage `ansible-playbook -i inventory --limit zone1_agent_1 patch_os.yml`
