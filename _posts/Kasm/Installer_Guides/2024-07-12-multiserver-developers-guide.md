---
layout: post
title: Kasm Multi-Server Installer Developers Guide
description: This document goes through the menu options and other options while explaining how the system is configured and works. Think of this as an extended guide explaining how everything works.
type: ccc
courses: {}
menu: nav/kasm_cloud.html
toc: true
comments: true
permalink: /kasm/multiserver/development
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

The script `install_dependencies.sh` goes through the installation process, however, you must make sure awscli is configured accordig to your user. You may also run the script manually to install dependences.

Secondly, the Kasm installer needs to be downloaded and placed in the right location. Navigate to [https://www.kasmweb.com/downloads.html](https://www.kasmweb.com/downloads.html) and download the latest version as a `tar.gz` (when you click download, that should be the format it is already in). Make sure the name has no additions to it by the operating system. Finally, place the `tar.gz` file in the directory `roles/install_common/files/kasm_release_{version}.tar.gz`.

```sh
chmod +x install_dependencies && ./install_dependencies.sh
```

The install script first checks to see if the user has a MacOS system. If so, it checks for the installation of Homebrew, the MacOS package manager.

```sh
# Check for and install Homebrew (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
  if ! command -v brew &>/dev/null; then
    echo "Homebrew not found. Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    if [ $? -ne 0 ]; then
      echo "Error: Homebrew installation failed."
      exit 1
    fi
  else
    echo "Homebrew is already installed."
  fi
else
  echo "Skipping Homebrew installation (not macOS)."
fi
```

If the user has a Linux system, the script checks for the installation of apt, yum, and snap through `command -v` in the installation functions. It then proceeds to install each package through the found package manager.

Example of one of the install functions:

```sh
# Function to install Ansible
install_ansible() {
  if command -v apt-get &>/dev/null; then
    sudo apt-get update -y
    sudo apt-get install -y ansible
  elif command -v yum &>/dev/null; then
    sudo yum install -y epel-release
    sudo yum install -y ansible
  elif command -v snap &>/dev/null; then
    sudo snap install ansible --classic
  elif command -v brew &>/dev/null; then
    brew install ansible
  else
    echo "Unsupported package manager. Please install Ansible manually."
    exit 1
  fi
}
```

Example usage of an install function:

```sh
# Install Ansible
if ! command -v ansible &>/dev/null; then
  echo "Ansible not found. Installing Ansible..."
  install_ansible
  if [ $? -ne 0 ]; then
    echo "Error: Ansible installation failed."
    exit 1
  fi
else
  echo "Ansible is already installed."
fi
```

The script then checks for the compressed Kasm installer in the right directory:

```sh
# Check for the Kasm release tar.gz file
if [ ! -f roles/install_common/files/*.tar.gz ]; then
  echo "Warning: No Kasm release .tar.gz file found in roles/install_common/files/."
else
  echo "Kasm release .tar.gz file found in roles/install_common/files/."
  echo "Please ensure this is the correct file for your installation."
fi
```

Once all these checks pass, the script gives the all-clear:

```sh
echo "All dependencies have been installed successfully."
```

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

The menu first checks for the dependencies script and then checks for dependencies:

```sh
# Run the install_dependencies.sh script
if [ -f ./install_dependencies.sh ]; then
  chmod +x install_dependencies.sh
  ./install_dependencies.sh
else
  echo "install_dependencies.sh script not found!"
  exit 1
fi
sleep 2 # So that people can see the results
clear # Make menu look nice
```

Then, the script outputs the ascii art in `ascii_launch`:

*In ascii_launch:*

```text
,--. ,--.                             ,--.   ,--.        ,--.  ,--.  ,--. ,---.                                        
|  .'   / ,--,--. ,---. ,--,--,--.    |   `.'   |,--.,--.|  |,-'  '-.`--''   .-'  ,---. ,--.--.,--.  ,--.,---. ,--.--. 
|  .   ' ' ,-.  |(  .-' |        |    |  |'.'|  ||  ||  ||  |'-.  .-',--.`.  `-. | .-. :|  .--' \  `'  /| .-. :|  .--' 
|  |\   \\ '-'  |.-'  `)|  |  |  |    |  |   |  |'  ''  '|  |  |  |  |  |.-'    |\   --.|  |     \    / \   --.|  |    
`--' '--' `--`--'`----' `--`--`--'    `--'   `--' `----' `--'  `--'  `--'`-----'  `----'`--'      `--'   `----'`--'   
```

*In main.sh:*

```sh
# Function to display file contents slowly
slow_cat() {
  local filename="$1"
  local delay="$2"

  # Check if the file exists
  if [ ! -f "$filename" ]; then
    echo "File not found!"
    return 1
  fi

  # Display the file contents line by line with a delay
  while IFS= read -r line || [[ -n "$line" ]]; do
    echo "$line"
    sleep "$delay" # Adjust the delay (in seconds) as needed
  done < "$filename"
}

# Print each line of the ASCII art slowly
ascii_art_file="ascii_launch"  # Store your ASCII art in this file
delay="0.5"  # Adjust the delay (in seconds) as needed

slow_cat "$ascii_art_file" "$delay"
```

After executing, the menu appears, where a user can select their option choices by case

```sh
# Display the menu and handle user input
while true; do
  show_menu
  read choice
  case $choice in
    1)
      echo "Installing Kasm..."
      ./launch.sh
      ;;
    2)
      echo "Install Kasm Images on Prewritten Inventory"
      echo "Make sure that docker is installed on all images, otherwise ctrl-c to escape"
      echo "Make sure the inventory file has init_remote_db: false for scaling"
      sleep 20
      ansible-playbook -i inventory install_kasm.yml
      ;;
    3)
      echo "Start Kasm"
      ansible-playbook -i inventory start_kasm.yml
      ;;
    4)
      echo "Stop Kasm"
      ansible-playbook -i inventory stop_kasm.yml
      ;;
    5)
      echo "Restart Kasm"
      ansible-playbook -i inventory restart_kasm.yml
      ;;
    6)
      echo "Update Kasm"
      echo "Please update the inventory file as needed and press Enter to continue..."
      read -r
      ansible-playbook -i inventory install_kasm.yml
      ;;
    7)
      echo "Uninstall Kasm"
      ansible-playbook -i inventory uninstall_kasm.yml
      ;;
    8)
      echo "Uninstall Kasm and delete instances"
      ansible-playbook -i inventory uninstall_kasm.yml
      terraform destroy -auto-approve
      ;;
    9)
      echo "Exiting..."
      break
      ;;
    *)
      echo "Invalid choice, please try again."
      ;;
  esac
done
```

Many of the options are handled directly in the script, but they will be explained in detail later below.

## (1) Installation of Multi-Server

Installing Kasm from scratch means that there are no pre-existing servers. Therefore, the script can do its job without having to worry about the inventory. If you have pre-existing servers, read the inventory_directory to configure the inventory to work with your servers, and make sure you allow your configured ports access to your servers. During the installation, `.txt` files will appear. It is recommended that they stay on the system, as some parts of the system may use them even after installation.

To install from scratch, we initialize the main script:

```sh
chmod +x main.sh && ./main.sh
```

We then select `1` on the menu, which first initializes the head install script:

```sh
#!/bin/bash

# Run the dependencies script
chmod +x install_dependencies.sh
./install_dependencies.sh

# Run the deployment script
chmod +x deploy.sh
./deploy.sh

sleep 20

# Run the command execution script
chmod +x execute_commands.sh
./execute_commands.sh

# Run the update inventory script
chmod +x update_inventory.sh
./update_inventory.sh

# Run the playbook script
chmod +x run_playbook.sh
./run_playbook.sh
```

Each script runs a different stage of the installation. First, we install dependencies through the dependencies script, as stated above. Then, we start deploying instances through terraform, where it first asks for some information.

Here is the completed information table:

| Variable               | Question                                            | Expected Responses                                                                                                                                                                                         |
|------------------------|-----------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Region                 | Enter AWS region                                    | This question expects the response of an AWS region, such as "us-west-1" so it can determine the AMI to use for Ubuntu 22.04. The accepted regions are "us-west-1", "us-west-2", "us-east-1", "us-east-2". |
| # Agent Servers        | Enter the number of agent servers (default 1)       | This question asks for the number of Kasm agent servers you would like to add. This expects a numerical argument, such as "3". The default (press ENTER) is "1".                                           |
| Agent Server Processor | Enter the size of agent servers (default t3.medium) | Asks for processing size of agent server, which is the type of processor selected in AWS. This has a default (press ENTER) of t3.medium, and accepts arguments similar to it.                              |
| Other Server Processor | Enter the size of other servers (DB, Guac, Web)     | Asks for the processing size of other servers, such as the DB, Guac, and Web servers. This has a default (press ENTER) of t3.medium, and accepts arguments similar to it.                                  |
| Agent Server Disk Size | Enter the disk size of agent servers in GB (default 50) | Asks for the disk size in GB of the agent servers. This has a default (press ENTER) of 50 GB, and accepts numerical arguments similar to it.                                                                |
| Other Server Disk Size | Enter the disk size of other servers (DB, Guac, Web) in GB (default 50) | Asks for the disk size in GB of the other servers, such as DB, Guac, and Web servers. This has a default (press ENTER) of 50 GB, and accepts numerical arguments similar to it.                              |
| Custom AMI ID          | Enter custom AMI ID if region-specific AMI is not available (leave blank if not needed) | Asks for a custom AMI ID if the region-specific AMI is not available. This field can be left blank if not needed.                                                                                           |

In the script `deploy.sh`, the user is asked to input these fields with defaults and then it applies them to the terraform script.

```sh
read -p "Enter AWS region: " region
read -p "Enter the number of agent servers (default 1): " agent_server_count
read -p "Enter the size of agent servers (default t3.medium): " agent_server_size
read -p "Enter the size of other servers (DB, Guac, Web) (default t3.medium): " other_server_size
read -p "Enter the disk size of agent servers in GB (default 50): " agent_server_disk_size
read -p "Enter the disk size of other servers (DB, Guac, Web) in GB (default 50): " other_server_disk_size
read -p "Enter custom AMI ID if region-specific AMI is not available (leave blank if not needed): " custom_ami

# Set default values if not provided
agent_server_count=${agent_server_count:-1}
agent_server_size=${agent_server_size:-"t3.medium"}
other_server_size=${other_server_size:-"t3.medium"}
agent_server_disk_size=${agent_server_disk_size:-50}
other_server_disk_size=${other_server_disk_size:-50}

# Initialize Terraform
terraform init

# run with vars
if [ -z "$custom_ami" ]; then # w/o custom ami
  terraform apply -var="region=$region" -var="agent_server_count=$agent_server_count" -var="agent_server_size=$agent_server_size" -var="other_server_size=$other_server_size" -var="agent_server_disk_size=$agent_server_disk_size" -var="other_server_disk_size=$other_server_disk_size" -auto-approve
else # w custom ami
  terraform apply -var="region=$region" -var="agent_server_count=$agent_server_count" -var="agent_server_size=$agent_server_size" -var="other_server_size=$other_server_size" -var="agent_server_disk_size=$agent_server_disk_size" -var="other_server_disk_size=$other_server_disk_size" -var="custom_ami=$custom_ami" -auto-approve
fi
```

Where now, we begin terraform configuration. The requests are stored in the vars file `variables.tf`:

```shell
variable "region" {
  description = "The AWS region to deploy in"
  type        = string
}

variable "agent_server_count" {
  description = "The number of agent servers"
  type        = number
  default     = 1
}

variable "agent_server_size" {
  description = "The size of agent servers"
  type        = string
  default     = "t3.medium"
}

variable "other_server_size" {
  description = "The size of other servers (DB, Guac, Web)"
  type        = string
  default     = "t3.medium"
}

variable "agent_server_disk_size" {
  description = "The disk size of agent servers in GB"
  type        = number
  default     = 50
}

variable "other_server_disk_size" {
  description = "The disk size of other servers (DB, Guac, Web) in GB"
  type        = number
  default     = 50
}

variable "custom_ami" {
  description = "Custom AMI ID if region-specific AMI is not available"
  type        = string
  default     = ""
}
```

The script then proceeds to `main.tf`. First, we set local variables for the amis so we can deploy in any region without having to worry about the changes between amis:

```shell
locals {
  amis = {
    "us-west-1" = "ami-0ff591da048329e00"
    "us-west-2" = "ami-0aff18ec83b712f05"
    "us-east-1" = "ami-0b72821e2f351e396"
    "us-east-2" = "ami-0862be96e41dcbf74"
  }

  agent_ami = lookup(local.amis, var.region, var.custom_ami)
  other_ami = lookup(local.amis, var.region, var.custom_ami)
}
```

Then, we create a SSH key so that we can SSH to each image, which will be needed later on.

```shell
resource "tls_private_key" "deployer" { # Generate key
  algorithm = "RSA"
  rsa_bits  = 2048
}

resource "aws_key_pair" "deployer" { # Assign key with random bit to aws
  key_name   = "deployer-key-${random_id.key_id.hex}"
  public_key = tls_private_key.deployer.public_key_openssh
}

resource "local_file" "private_key" { # Write key to host
  content  = tls_private_key.deployer.private_key_pem
  filename = "${path.module}/deployer-key-${random_id.key_id.hex}.pem"
  file_permission = "0600"
}

resource "random_id" "key_id" { # random ending so if multiple people are using then the keys don't get mixed
  byte_length = 4
}
```

Since Kasm uses the ports 22 (ssh), 5432 (database), 6379 (redis), and 443 (web), we need to allow connections to those ports from the security group. This is where we create our security group so that the resources can access each other.

```shell
resource "aws_security_group" "kasm_sg" {
  name        = "kasm_sg"
  description = "Security group for Kasm servers"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] 
  }

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress { # All ports send output
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

Next, the system creates the images. For the agent servers, it uses a count increment method to dynamically assign names to each of the agent servers.

```shell
resource "aws_instance" "agent_servers" {
  count         = var.agent_server_count
  ami           = local.agent_ami
  instance_type = var.agent_server_size
  key_name      = aws_key_pair.deployer.key_name
  security_groups = [aws_security_group.kasm_sg.name]

  root_block_device {
    volume_size = var.agent_server_disk_size
    volume_type = "gp2"
  }

  tags = {
    Name = "kasm-agent-${count.index + 1}"
  }
}
```

After, it creates servers for web, db, and guac:

```shell
resource "aws_instance" "db_server" {
  ami           = local.other_ami
  instance_type = var.other_server_size
  key_name      = aws_key_pair.deployer.key_name
  security_groups = [aws_security_group.kasm_sg.name]

  root_block_device {
    volume_size = var.other_server_disk_size
    volume_type = "gp2"
  }

  tags = {
    Name = "kasm-db"
  }
}

resource "aws_instance" "guac_server" {
  ami           = local.other_ami
  instance_type = var.other_server_size
  key_name      = aws_key_pair.deployer.key_name
  security_groups = [aws_security_group.kasm_sg.name]

  root_block_device {
    volume_size = var.other_server_disk_size
    volume_type = "gp2"
  }

  tags = {
    Name = "kasm-guac"
  }
}

resource "aws_instance" "web_server" {
  ami           = local.other_ami
  instance_type = var.other_server_size
  key_name      = aws_key_pair.deployer.key_name
  security_groups = [aws_security_group.kasm_sg.name]

  root_block_device {
    volume_size = var.other_server_disk_size
    volume_type = "gp2"
  }

  tags = {
    Name = "kasm-web"
  }
}
```

Finally, to top of the creation, the system creates an Elastic IP address (EIP) for the web server to prevent it from changing, and assigns it to the web image.

```shell
resource "aws_eip" "web_server_eip" {
  instance = aws_instance.web_server.id
}
```

After this, the system outputs all the data to the script, which captures it and places it in files.

### In outputs.tf

```shell
output "agent_server_ips" {
  value = [for instance in aws_instance.agent_servers : instance.public_ip]
}

output "db_server_ip" {
  value = aws_instance.db_server.public_ip
}

output "guac_server_ip" {
  value = aws_instance.guac_server.public_ip
}

output "web_server_ip" {
  value = aws_eip.web_server_eip.public_ip
}

output "key_name" {
  value = aws_key_pair.deployer.key_name
}
```

### In deploy.sh

```sh
# Capture IP addresses from Terraform output
agent_server_ips=$(terraform output -json agent_server_ips | jq -r '.[]')
db_server_ip=$(terraform output -json db_server_ip | jq -r '.')
guac_server_ip=$(terraform output -json guac_server_ip | jq -r '.')
web_server_ip=$(terraform output -json web_server_ip | jq -r '.')

# Store IP addresses in files
echo "$agent_server_ips" > agent_server_ips.txt
echo "$db_server_ip" > db_server_ip.txt
echo "$guac_server_ip" > guac_server_ip.txt
echo "$web_server_ip" > web_server_ip.txt

# Get the generated key file name
key_name=$(terraform output -raw key_name)
key_file="${key_name}.pem"
echo "$key_file" > key_file.txt
```

This ends the terraform section of the script. Now, the system will SSH to each instance and install `docker`.

First, we load the necessary information from the files:

```sh
# Load IP addresses from files
agent_server_ips=$(cat agent_server_ips.txt)
db_server_ip=$(cat db_server_ip.txt)
guac_server_ip=$(cat guac_server_ip.txt)
web_server_ip=$(cat web_server_ip.txt)

# Load the SSH key file name
key_file=$(cat key_file.txt)
```

Then, we initialize our commands that we need to run to install docker:

```sh
# Commands to run on each server
commands=$(cat <<'EOF'
#!/bin/bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo apt-get install -y docker-compose
EOF
)
```

Finally, we SSH to each instance and run the commands:

```sh
# Function to SSH and run commands
run_commands() {
  local ip=$1
  ssh -i "$key_file" -o StrictHostKeyChecking=no ubuntu@"$ip" <<EOF
    sudo bash -c '$commands'
EOF
}

# Run commands on agent servers
for ip in $agent_server_ips; do
  run_commands "$ip"
done

# Run commands on DB server
run_commands "$db_server_ip"

# Run commands on Guac server
run_commands "$guac_server_ip"

# Run commands on Web server
run_commands "$web_server_ip"
```

Now, we update the inventory file on the system so we can give ansible the correct information that it needs. Again, we first load the necessary information:

```sh
# Load IP addresses from files
agent_server_ips=$(cat agent_server_ips.txt)
db_server_ip=$(cat db_server_ip.txt)
guac_server_ip=$(cat guac_server_ip.txt)
web_server_ip=$(cat web_server_ip.txt)

# Load the SSH key file name
key_file=$(cat key_file.txt)
```

Then we ask the user which passwords they want to set for their Kasm deployment:

```sh
# Prompt user for passwords with default values
read -p "Enter user password [default: password]: " user_password
user_password=${user_password:-password}

read -p "Enter admin password [default: password]: " admin_password
admin_password=${admin_password:-password}

read -p "Enter database password [default: password]: " database_password
database_password=${database_password:-password}

read -p "Enter redis password [default: password]: " redis_password
redis_password=${redis_password:-password}

read -p "Enter manager token [default: password]: " manager_token
manager_token=${manager_token:-password}

read -p "Enter registration token [default: password]: " registration_token
registration_token=${registration_token:-password}
```

Then, we put the information in the inventory file:

```sh
# Create a new inventory file
cat <<EOF > inventory
##################
# Host inventory #
##################
all:
  children:
    zone1:
      children:
        zone1_db:
          hosts:
            zone1_db_1:
              ansible_host: $db_server_ip  # Updated IP for KasmDBServer
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: $key_file
        zone1_web:
          hosts:
            zone1_web_1:
              ansible_host: $web_server_ip  # Updated IP for KasmWebServer
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: $key_file
        zone1_agent:
EOF

# Add agent server IPs
index=1
for ip in $agent_server_ips; do
  cat <<EOF >> inventory
            zone1_agent_$index:
              ansible_host: $ip  # Updated IP for KasmAgentServer
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: $key_file
EOF
  index=$((index + 1))
done

# Add the remaining sections
cat <<EOF >> inventory
        zone1_guac:
          hosts:
            zone1_guac_1:
              ansible_host: $guac_server_ip  # Updated IP for KasmGuacServer
              ansible_port: 22
              ansible_ssh_user: ubuntu
              ansible_ssh_private_key_file: $key_file
  vars:
    default_web: 1
    user_password: $user_password
    admin_password: $admin_password
    database_password: $database_password
    redis_password: $redis_password
    manager_token: $manager_token
    registration_token: $registration_token
    zones:
      - zone1
    proxy_port: 443
    start_docker_on_boot: true
    desired_swap_size: 3g
    init_remote_db: false
    database_hostname: false
    database_user: kasmapp
    database_name: kasm
    database_port: 5432
    database_ssl: true
    redis_hostname: false
    remote_backup_dir: /srv/backup/kasm/
    retention_days: 10
    reboot_timeout_seconds: 600
EOF
```

The table of passwords is shown below:

| Variable             | Question                                               | Expected Responses                                                                                                                                                                              |
|----------------------|--------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Kasm User Password   | Enter user password [default: password]                | Asks the user for the local kasm user's (user@kasm.local) password, and has a default (press ENTER) password of "password".                                                                     |
| Admin Password       | Enter admin password [default: adminpassword]          | Asks the user for the admin user's password, and has a default (press ENTER) password of "adminpassword".                                                                                       |
| DB Password          | Enter database password [default: dbpassword]          | Asks the user for the database user's password, and has a default (press ENTER) password of "dbpassword".                                                                                       |
| Redis Password       | Enter Redis password [default: redispassword]          | Asks the user for the Redis user's password, and has a default (press ENTER) password of "redispassword".                                                                                       |
| Manager Token        | Enter manager token [default: managertoken]            | Asks the user for the manager token, and has a default (press ENTER) token of "managertoken".                                                                                                   |
| Registration Token   | Enter registration token [default: registrationtoken]  | Asks the user for the registration token, and has a default (press ENTER) token of "registrationtoken".                                                                                         |

These passwords should be stored somewhere safe, as you will need them to log onto and maintain the system. These passwords can be recovered from the inventory file in case.

After setting the passwords, the system will begin the multi-server installation of the Kasm system. The system will proceed to installing the Kasm docker images onto the instances.

```sh
#!/bin/bash

# Ensure the inventory file and playbook exist
if [ ! -f inventory ]; then
  echo "Error: inventory file not found!"
  exit 1
fi

if [ ! -f install_kasm.yml ]; then
  echo "Error: Ansible playbook install_kasm.yml not found!"
  exit 1
fi

# Run the Ansible playbook
ansible-playbook -i inventory install_kasm.yml

# Check if the playbook ran successfully
if [ $? -eq 0 ]; then
  echo "Ansible playbook executed successfully."
else
  echo "Error: Ansible playbook execution failed."
  exit 1
fi
```

The `install_kasm.yml` file contains the head of the kasm install script. It passes the script onto `roles/install_common/main.yml`:

```yml
- hosts: all
  roles:
    - install_common
  any_errors_fatal: true
```

{% raw %}

```yml
- include_tasks: 
    file: default_credentials.yml

- name: Check if Kasm is installed
  stat: 
    path: /opt/kasm/current
  register: kasm_path

- set_fact:
    kasm_installed: "{{ kasm_path.stat.exists }}"

- set_fact:
    web_ip: "{{ hostvars[group_names[0] + '_web_' + inventory_hostname.split('_')[2]].ansible_default_ipv4.address }}"
    # IP of the host that ansible is being ran against
    target_ip: "{{ ansible_default_ipv4.address }}"
  when: not default_web

- set_fact:
    web_ip: "{{ hostvars[group_names[0] + '_web_' + default_web|string].ansible_default_ipv4.address }}"
    # IP of the host that ansible is being ran against
    target_ip: "{{ ansible_default_ipv4.address }}"
  when: default_web

- set_fact:
    db_ip: "{{ hostvars['zone1_db_1'].ansible_default_ipv4.address }}"
  when: not database_hostname

- set_fact:
    db_ip: "{{ database_hostname }}"
  when: database_hostname

- set_fact:
    redis_ip: "{{ hostvars['zone1_db_1'].ansible_default_ipv4.address }}"
  when: not redis_hostname

- set_fact:
    redis_ip: "{{ redis_hostname }}"
  when: redis_hostname

- name: Override manager hostname if configured
  set_fact:
    web_ip: "{{ manager_hostname }}"
  when: manager_hostname is defined

- name: Check if kasm swapfile exists
  stat:
    path: /mnt/kasm.swap
  register: kasm_swapfile
  when:
    - "'agent' in group_names[1].split('_')"

- name: Get current swapsize in bytes
  # Meminfo outputs in Kb for some reason so we convert to bytes
  shell: cat /proc/meminfo | grep SwapTotal | awk '{print $2 * 1024}'
  register: current_swap_size
  changed_when: false
  when:
    - "'agent' in group_names[1].split('_')"

- set_fact:
    # We only want to make a swapfile large enough to make up the difference between
    # the current swapsize and our desired size.
    new_swap_size: "{{ desired_swap_size | human_to_bytes - current_swap_size.stdout | int }}"
  when:
    - "'agent' in group_names[1].split('_')"

- debug:
    var: new_swap_size
  when:
    - "'agent' in group_names[1].split('_')"

- name: Run swap tasks
  include_tasks:
    file: mkswap.yml
  when:
    - "'agent' in group_names[1].split('_')"
    - new_swap_size | int > 0
    - not kasm_swapfile.stat.exists

- name: Create temporary directory
  tempfile:
    state: directory
  register: tempdir

# Debian 10 doesn't ship with the ca-certificates package installed by default
# installing curl is portable to to ensure that ca-certificates is installed
- name: Ensure we have curl installed
  package:
    name: curl
    state: present
  become: true
```

The script then copies the installer with this line, which references another file:

```yml
- include_tasks:
    file: copy_installer.yml
  when:
    - not kasm_installed
```

Which results in the tasks:

```yml
# List of files in the files directory matching the installer, service_images, and workspace images.
- set_fact:
    installer_glob: "{{ lookup('fileglob', '{{role_path}}/files/kasm_workspaces_*.tar.gz', wantlist=True) + lookup('fileglob', '{{role_path}}/files/kasm_release_*.tar.gz', wantlist=True) }}"
    service_images_glob: "{{ lookup('fileglob', '{{role_path}}/files/kasm_workspaces_service_images*.tar.gz', wantlist=True) + lookup('fileglob', '{{role_path}}/files/kasm_release_service_images*.tar.gz', wantlist=True) }}"
    workspace_images_glob: "{{ lookup('fileglob', '{{role_path}}/files/kasm_workspaces_workspace_images_*.tar.gz', wantlist=True) + lookup('fileglob', '{{role_path}}/files/kasm_release_workspace_images_*.tar.gz', wantlist=True)  }}"
  delegate_to: localhost

- set_fact:
    # Our installer glob search will also include service_images and workspace_images so we filter them out with difference()
    installer_file: "{{ installer_glob | difference(service_images_glob) | difference(workspace_images_glob) | first | default(None) }}"
    service_images_file: "{{ service_images_glob | first | default(None) }}"
    workspace_images_file: "{{ workspace_images_glob | first | default(None) }}"

- name: Assert that Kasm installer exists
  assert:
    that:
      - installer_file
    fail_msg:
      - "Kasm installer not found"
      - "Ensure that kasm_workspaces installer tarfile is in {{role_path}}/files/"

- name: unarchive kasm installer
  unarchive:
    src: "{{ installer_file }}"
    dest: "{{ tempdir.path }}"

- name: Copy service images
  copy:
    src: "{{ service_images_file }}"
    dest: "{{ tempdir.path }}"
  register: service_images_copy
  when: service_images_file

- name: Copy Workspace images
  copy:
    src: "{{ workspace_images_file }}"
    dest: "{{ tempdir.path }}"
  register: workspace_images_copy
  when: workspace_images_file
```

Like this, many other tasks are run, most of them one line arguments to run the Kasm installer on the instances. This continues for a while until the end:

```yml
- name: Add additional zones tasks
  include_tasks:
    file: add_zones.yml
  when:
    - not kasm_installed

- name: Run Kasm db install tasks
  include_tasks:
    file: db_install.yml
  when:
    - "'db' in group_names[1].split('_')"
    - not kasm_installed

- name: Run remote db init tasks
  include_tasks:
    file: remote_db_init.yml
  when:
    - init_remote_db
    - database_hostname
    - "'web' in group_names[1].split('_')"
    - not kasm_installed

- name: Run Kasm web install tasks
  include_tasks:
    file: web_install.yml
  when:
    - "'web' in group_names[1].split('_')"
    - not kasm_installed

- name: Run Kasm agent install tasks
  include_tasks:
    file: agent_install.yml
  when:
    - "'agent' in group_names[1].split('_')" 
    - not kasm_installed

- name: Run Kasm guac install tasks
  include_tasks:
    file: guac_install.yml
  when:
    - "'guac' in group_names[1].split('_')"
    - not kasm_installed

- name: Run Kasm proxy install tasks
  include_tasks:
    file: proxy_install.yml
  when:
    - "'proxy' in group_names[1].split('_')"
    - not kasm_installed
```

At the end, the installer runs some cleanup jobs and outputs relevant information, as shown below in `main.yml`:

```yml
- name: enable the docker service to run at boot
  service:
    name: docker
    enabled: true
  become: true
  when: start_docker_on_boot
  
- name: Delete temporary directory
  file:
    path: "{{ tempdir.path }}"
    state: absent
  become: true

- name: Print credentials
  debug:
    msg:
      - "Database Password: {{ database_password }}"
      - "Redis Password: {{ redis_password }}"
      - "Manager Token: {{ manager_token }}"
      - "Registration Token: {{ registration_token }}"
      - "user@kasm.local password: {{ user_password }}"
      - "admin@kasm.local password: {{ admin_password }}"
  run_once: true

- name: Write credentials to inventory
  run_once: true
  delegate_to: localhost
  ansible.builtin.template:
    src: "{{ inventory_file }}"
    dest: "{{ inventory_file }}"

- name: Set credentials to active
  run_once: true
  delegate_to: localhost
  ansible.builtin.replace:
    dest: "{{ inventory_file }}"
    regexp: "{{ item.from }}"
    replace: "{{ item.to }}"
  loop:
    - {from: "#user_password", to: "user_password"}
    - {from: "#admin_password", to: "admin_password"}
    - {from: "#database_password", to: "database_password"}
    - {from: "#redis_password", to: "redis_password"}
    - {from: "#manager_token", to: "manager_token"}
    - {from: "#registration_token", to: "registration_token"}

- name: Turn off remote db init
  run_once: true
  delegate_to: localhost
  ansible.builtin.replace:
    dest: "{{ inventory_file }}"
    regexp: "init_remote_db: true"
    replace: "init_remote_db: false"
  when:
    - init_remote_db
    - database_hostname
```

Once the system is finished, it will be complete with the installation. You can now access your Kasm multi-server instance at `https://{your-web-ip}`, which can be found by the command:

```sh
cat web_server_ip.txt
```

### If blocked

If blocked, click on Advanced and then Proceed to the Connection to access the system.

## (2) Installation of Kasm on Prewritten Inventory

To just install the Kasm Docker images, you can manually edit the `inventory` file using the inventory instructions located in `inventory_directory`, where each comment or variable name explains how to configure the system.

**This just performs the ansible installation, to review that, please reread the above section.
**

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

#### First remove the `zone1_db` entry from inventory:

```yaml
        #zone1_db:
          #hosts:
            #zone1_db_1:
              #ansible_host: zone1_db_hostname
              #ansible_port: 22
              #ansible_ssh_user: ubuntu
              #ansible_ssh_private_key_file: ~/.ssh/id_rsa
```

#### Set the relevant credentials and enpoints:

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

#### Run the deployment:

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

This command runs the playbook for the yml file for start_kasm, which looks like this:

```yml
- hosts: all
  serial: 1
  gather_facts: no
  tasks:
    - name: Start Kasm Services
      shell: /opt/kasm/bin/start
      register: start_output
      changed_when: '"done" in start_output.stderr'
      become: true
```

Which runs the start binary on all hosts.

## (4) Stop Kasm

To stop the Kasm network, and take it offline, you may do so with option 4.

For more specific stop commands:

Stop Kasm Workspaces (stop_kasm.yml)- This will stop all hosts defined in inventory or optionally be limited to a zone, group or single server passing the `--limit` flag. Example Usage `ansible-playbook -i inventory --limit zone1_agent_1 stop_kasm.yml`

This command runs the playbook for the yml file for stop_kasm, which looks like this:

```yml
- hosts: all
  serial: 1
  gather_facts: no
  tasks:
    - name: Stop Kasm Services
      shell: /opt/kasm/bin/stop
      register: stop_output
      changed_when: '"done" in stop_output.stderr'
      become: true
```

Which runs the stop binary on all hosts.

## (5) Restart Kasm

To stop the Kasm network, and take it offline, you may do so with option 4.

For more specific restart commands:

Restart Kasm Workspaces (restart_kasm.yml)- This will restart all hosts defined in inventory or optionally be limited to a zone, group or single server passing the `--limit` flag. Example Usage `ansible-playbook -i inventory --limit zone1_agent_1 restart_kasm.yml`

This command runs the playbook for the yml file for restart_kasm, which just runs the playbooks for stop_kasm and start_kasm:

```yml
- import_playbook: stop_kasm.yml

- import_playbook: start_kasm.yml
```

## (6) Update Kasm

This will update the Kasm framework on the hosts using the install playbook, as ansible skips over what is already configured and adds new things to the system easily (see [https://github.com/open-coding-society/kasm-multi-server/issues/4](https://github.com/open-coding-society/kasm-multi-server/issues/4)).

### Scaling the deployment

The installation can be "scaled up" after being installed by adding any additional hosts including entire new zones. Once modified run: 

Option 2 on the Menu or `ansible-playbook -i inventory install_kasm.yml`

Before running the installation against a modified inventory file please ensure the credentials lines in your inventory were set and uncommented properly by the initial deployment IE. If installed through the menu, they should already be replaced.

```
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

```
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

```
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

```
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

```
sudo grep " password" /opt/kasm/current/conf/app/api.app.config.yaml
```

- Existing Redis password can be obtained by logging into a webapp host and running the following command:

```
sudo grep "redis_password" /opt/kasm/current/conf/app/api.app.config.yaml
```

- Existing Manager token can be obtained by logging into an agent host and running the following command:

```
sudo grep "token" /opt/kasm/current/conf/app/agent.app.config.yaml
```

## (7) Uninstall Kasm

Uninstalls the Kasm workspace off of the images, but leaves the images intact.

After running `uninstall_kasm.yml`, the order is passed off to `roles/uninstall/main.yml`, which first checks for docker images and removes them and the docker network off the system, then double checks and removes them if they are still there, and finally cleans up the directories.

```yml
- name: Check for kasm service containers
  shell: docker ps -f name=kasm_* -qa
  register: service_containers
  changed_when: false
  become: true
  ignore_errors: true

- name: Remove any kasm service containers
  shell: "docker rm -f {{ item }}"
  become: true
  ignore_errors: true
  with_items: "{{ service_containers.stdout_lines }}"

- name: Check for kasm session containers
  shell: docker container ls -qa --filter=label=kasm.kasmid
  register: session_containers
  changed_when: false
  become: true
  ignore_errors: true
  
- name: Remove any kasm session containers
  shell: "docker rm -f {{ item }}"
  ignore_errors: true
  become: true
  with_items: "{{ session_containers.stdout_lines }}"

- name: Check for kasm docker network
  shell: docker network ls -q -f name=kasm_default_network
  register: kasm_network
  become: true
  ignore_errors: true
  changed_when: false

- name: Remove kasm docker network
  shell: docker network rm kasm_default_network
  ignore_errors: true
  become: true
  when: kasm_network.stdout | length > 0

- name: Get kasm database docker volume
  shell: docker volume ls --filter name=kasm_db_* -q
  ignore_errors: true
  become: true
  register: kasm_database
  changed_when: false

- name: Remove kasm database docker volume
  shell: "docker volume rm {{ item }}"
  ignore_errors: true
  become: true
  with_items: "{{ kasm_database.stdout_lines }}"

- name: Get kasm docker images
  shell: |
    docker images --filter "label=com.kasmweb.image=true" -q
    docker images kasmweb/nginx -q
    docker images kasmweb/share -q
    docker images kasmweb/share-private -q
    docker images kasmweb/agent -q
    docker images kasmweb/agent-private -q
    docker images kasmweb/manager -q
    docker images kasmweb/manager-private -q
    docker images kasmweb/api -q
    docker images kasmweb/api-private -q
    docker images kasmweb/guac -q
    docker images kasmweb/guac-private -q
    docker images kasmweb/proxy -q
    docker images kasmweb/proxy-private -q
    docker images redis -q
    docker images postgres -q
    
  register: kasm_images
  become: true
  ignore_errors: true
  changed_when: false

- name: Remove kasm docker images
  shell: "docker rmi {{ item }}"
  become: true
  ignore_errors: true
  with_items: "{{ kasm_images.stdout_lines }}"

- name: Remove kasm install directory
  file:
    path: /opt/kasm/
    state: absent
  become: true
```

## (8) Uninstall Kasm and Delete the Instances

Uninstalles the Kasm workspaces and deletes the instances. This runs the `uninstall_kasm` playbook, however, it also destroys everything in terraform.

## EXTRA Commands/All Other Helper Playbooks

* Uninstall Kasm Workspaces (uninstall_kasm.yml)- This will completely purge your Kasm Workspaces installation on all hosts, if using a remote database that data will stay intact no remote queries will be executed. Example Usage: `ansible-playbook -i inventory uninstall_kasm.yml`
* Stop Kasm Workspaces (stop_kasm.yml)- This will stop all hosts defined in inventory or optionally be limited to a zone, group or single server passing the `--limit` flag. Example Usage `ansible-playbook -i inventory --limit zone1_agent_1 stop_kasm.yml`
* Start Kasm Workspaces (start_kasm.yml)- This will start all hosts defined in inventory or optionally be limited to a zone, group or single server passing the `--limit` flag. Example Usage `ansible-playbook -i inventory --limit zone1_agent_1 start_kasm.yml`
* Restart Kasm Workspaces (restart_kasm.yml)- This will restart all hosts defined in inventory or optionally be limited to a zone, group or single server passing the `--limit` flag. Example Usage `ansible-playbook -i inventory --limit zone1_agent_1 restart_kasm.yml`
* Backup Database (backup_db.yml)- This will make a backup of a managed Docker based db server, this playbook will not function with a remote db type installation. Example Usage `ansible-playbook -i inventory backup_db.yml`
    * Modify `remote_backup_dir` in inventory to change the path the remote server stores the backups
    * Modify `retention_days` in inventory to change the number of days that logs backups are retained on db host
    * Set `local_backup_dir` to define a path on the local ansible host where backups will be stored, if unset backups will only exist on the remote server
* OS Patching (patch_os.yml)- This will update system packages and reboot on all hosts defined in inventory or optionally be limited to a zone, group or single server passing the `--limit` flag. Example Usage `ansible-playbook -i inventory --limit zone1_agent_1 patch_os.yml`


For backup_db.yml`, the database is pulled off of the images and placed on the host using a combination of ansible and shell.

*In backup_db.yml*

```yml
- name: Ensure backup directory exists
  file:
    path: "{{ remote_backup_dir }}"
    state: directory
  become: true

- name: Backup database
  script: "files/backup.sh {{ remote_backup_dir }} {{ retention_days }}"
  register: backup_output
  become: true

# Pull the remote backup file from stdout of the backup script
- set_fact:
    remote_backup: "{{ backup_output.stdout_lines[-1:][0] }}"

- name: Copy database backup to ansible host
  fetch:
    src: "{{ remote_backup }}"
    dest: "{{ local_backup_dir }}"
    flat: true
  when: local_backup_dir is defined
```

*In backup.sh*

```sh
#!/bin/bash
# $1 is the backup directory
# $2 is the retention period in days

set -ex



if [ -z "$1" ] ; then
    echo "FATAL: Missing output dir argument"
    exit 1
else
    OUTPUT_DIR=$1
fi

if [ ! -d $OUTPUT_DIR ]; then
    echo "FATAL: Cannot find dir $OUTPUT_DIR"
    exit 1
fi

if [ -z "$2" ] ; then
    echo "FATAL: Missing retention period argument"
    exit 1
else
    RETENTION_DAYS=$2
fi

mkdir -p $OUTPUT_DIR/$HOSTNAME

docker exec kasm_db /bin/bash -c "pg_dump -U kasmapp -w -Ft --exclude-table-data=logs kasm | gzip > /tmp/db_backup.tar.gz"

DATE=`date "+%Y%m%d_%H.%M.%S"`
OUTPUT_FILE=$OUTPUT_DIR/$HOSTNAME/kasm_db_backup_${HOSTNAME}_${DATE}.tar.gz

# Copy the backup locally
docker cp kasm_db:/tmp/db_backup.tar.gz $OUTPUT_FILE

# Delete files older than 10 days
find $OUTPUT_DIR/$HOSTNAME -name *.tar.gz -mtime +"$RETENTION_DAYS" -type f -delete

echo "Database backed up to:"
echo "$OUTPUT_FILE"
```

For `patch_os.yml`, apt is just upgraded and all packages are brought online. Firstly, it stops Kasm, applies updates, and then starts Kasm with the playbooks.

```yml
- name: Update systems with yum package manager
  yum:
    name: "*"
    state: latest
  notify: Reboot server
  when:  ansible_pkg_mgr in ("yum", "dnf")
  become: true

- name: Update system with apt package manager
  apt:
    update_cache: yes
    upgrade: dist
    autoremove: yes
  notify: Reboot server
  when: ansible_pkg_mgr == "apt"
  become: true
```
{% endraw %}