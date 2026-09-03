#!/bin/bash

# Upgrade and install packages for Ubuntu
echo "=== Upgrade Packages ==="
sudo apt update

# Install Java 17
echo "=== Install Java 17 ==="
sudo apt install -y openjdk-17-jdk-headless
sudo apt install -y openjdk-17-jre

# Clone the IJava repository into /tmp
cd /tmp
git clone https://github.com/frankfliu/IJava.git
cd IJava

# Install the Jupyter Java kernel
./gradlew installKernel

# Clean up by removing the IJava directory
cd /tmp
rm -rf IJava
