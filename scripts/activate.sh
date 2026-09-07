# Prompt and set GitHub config
read -p "Enter your Git username: " GIT_USER_NAME
read -p "Enter your Git email: " GIT_USER_EMAIL

git config --global user.name "$GIT_USER_NAME"
git config --global user.email "$GIT_USER_EMAIL"

echo "Git User: $(git config --global user.name)"
echo "Git Email: $(git config --global user.email)"