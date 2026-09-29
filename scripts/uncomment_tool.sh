#!/usr/bin/env bash

# Name: uncomment_file
# 
# Description: 
#       Take either a javascript or python file and remove all single line and multiline comments.
#       The still commented file will be saved in /tmp/uncomment_tool/{filename}_uncomment so changes can be undone.
#
# Arguments: 
#       File Name: The complete path with extension of the file (only js and py extensions accepted)
#       Show Errors: Suppress errors if function is being called by uncomment_directory function.
#       Set true to show errors and false to suppress them.
#
# Returns: 
#       Return 1: File does not exist
#       Return 2: Invalid file type was provided
function uncomment_file()
{
    # Check if the provided file exists
    if [[ ! -f $1 ]];
    then
        # Suppress error if function is being called by uncomment_directory function
        if [[ $2 == true ]];
        then
            echo "$1 is not a file"
        fi
        return 1
    # Check if file extension is valid
    elif [[ ! $1 =~ .*\.(js|py|md) ]];
    then
        # Suppress error if function is being called by uncomment_directory function
        if [[ $2 == true ]];
        then
            echo "$1 is an invalid file type"
        fi
        return 2
    fi

    temp_file="/tmp/uncomment_tool/${1##*/}_uncomment"

    # Check if the /tmp/uncomment_tool file exists and make it if it doesn't
    if [[ ! -d "/tmp/uncomment_tool" ]];
    then
        mkdir "/tmp/uncomment_tool"
    fi

    # If the temp_file exists then remove it so we can re-make it
    if [[ -f "$temp_file" ]];
    then
        rm "$temp_file"
    fi

    touch "$temp_file"

    # Initialize all of the possible comment options for js and py
    begining_comment_patterns=("([^\/\/]*)\/\/.*" "([^\#]*)\#.*" "([^\/\*]*)\/\*.*\/\*" "([^\"\"\"]*)\"\"\".*\"\"\"" "([^\'\'\']*)\'\'\'*.\'\'\'" "([^\/\*]*)\/\*.*" "([^\"\"\"]*)\"\"\".*" "([^\`\`\`]*)\'\'\'.*" "^---")

    end_comment_patterns=(".*\*\/(.*)" ".*\"\"\"(.*)" ".*\'\'\'(.*)" "^---")

    # A flag that will set when a block comment is detected so everything in between the markers gets deleted
    block_comment="false"

    # Loop through the provided file to uncomment
    while IFS= read line;
    do
        match_found="false"
        # Check to see if we are currently in a block comment
        if [[ $block_comment == false ]];
        then
            # Loop through all of the begining comment patterns
            counter=0
            for pattern in "${begining_comment_patterns[@]}";
            do
                # Check to see if the current line matches a comment pattern
                if [[ "$line" =~ $pattern ]];
                then
                    match_found="true"
                    # The patterns after index one in the pattern list are block comments so we need to set block_comment to true
                    if [[ $counter -gt 4 ]];
                    then
                        block_comment="true"
                    fi

                    # Copy the line without the commented section into the temp file
                    echo "${BASH_REMATCH[1]}" >> "$temp_file"
                    break
                fi
                (( counter++ ))
            done
        # We are in a block comment
        else
            # Loop through the patterns for the end of a block comment
            for pattern in "${end_comment_patterns[@]}";
            do
                # Check to see if the current line matches an end comment pattern
               if [[ "$line" =~ $pattern ]];
               then
                    # Set the block comment to false so we start copying lines into the temp file again
                    match_found="true"
                    block_comment="false"

                    # Copy the line without the commented section into the temp file
                    echo "${BASH_REMATCH[1]}" >> "$temp_file"
                    break
               fi 
            done
        fi

        # If a match wasn't found with any of the comment patterns then copy the line into the temp file
        if [[ $match_found == false && $block_comment == false ]];
        then
            echo "$line" >> "$temp_file"
        fi
    done < "$1"

    # Switch the temp file with the current file so the provided file is uncommented
    in_between_file="/tmp/uncomment_tool/${1##*/}_in_between"

    touch "$in_between_file"

    mv "$1" "$in_between_file"

    mv "$temp_file" "$1"

    mv "$in_between_file" "$temp_file"

    echo "$1 was uncommented"
}

# Name: uncomment_directory
#
# Description: 
#       Take a valid directory path and call uncomment_file on every valid file (only javascript and python files)
#
# Arguments:
#       Directory Name: Valid complete directory path (. will be accepted as the current directory)
#
# Returns:
#       Exit 1: The provided directory is invalid
function uncomment_directory()
{
    # Check to make sure the directory exists
    if [[ ! -d $1 ]];
    then
        echo "$1 is not a directory"
        exit 1
    fi

    # loop through every file in the directory provided suppressing error messages from the uncomment_file function
    for file in $(ls "$1");
    do
        uncomment_file "$file" "false"
    done
}

# Name: undo
#
# Description: 
#       Take a valid filename and undo the changes made by uncomment_file.
#       If no changes were made by the uncomment_file function then an undo won't be made.
#       If the clean function has been run before running this function then it won't work.
#       The file that undo pulls from to preform the action is stored in /tmp/uncomment_tool/{filename}_uncomment
#
# Arguments:
#       File Name: The complete path with the extension of the file (only js and py extensions accepted)
#
# Returns:
#       Exit 5: The undo file was not found in /tmp/uncomment_tool/{filename}_uncomment
function undo()
{
    temp_file="/tmp/uncomment_tool/${1##*/}_uncomment"

    # Check to see if the temp file exists to undo with
    if [[ ! -f "$temp_file" ]];
    then
        echo "Unable to undo changes to $1"
        exit 5
    fi

    # Swap the provided file with the saved temp file
    in_between_file="/tmp/uncomment_tool/${1##*/}_in_between"

    touch "$in_between_file"

    mv "$1" "$in_between_file"

    mv "$temp_file" "$1"

    mv "$in_between_file" "$temp_file"

    echo "Changes have been undone"
}

# Name: clean
#
# Description: 
#       Removes the temporary files created by uncomment_file by performing rm on /tmp/uncomment_tool
#
# Returns:
#       Exit 3: The user entered "n" to the continue prompt
#       Exit 4: The user entered an invalid option to the continue prompt
function clean()
{
    echo "After clean has run any changes cannot be undone"
    read -p "Continue?(y|n)"

    case $REPLY in
        y)
            rm -rf /tmp/uncomment_tool
            ;;
        n)
            exit 3
            ;;
        *)
            echo "Invalid option"
            exit 4
            ;;
    esac
}

# Script entry point
echo -e "1. Uncomment File\n2. Uncomment Directory\n3. Undo\n4. Clean"

read -p ": " menu_selection

case $menu_selection in
    1) # Uncomment file
        read -e -p "File name: " filename
        filename="${filename/#\~/$HOME}"
        uncomment_file "$filename" "true"
        ;;
    2) # Uncomment directory
        read -e -p "Directory name: " directory
        directory="${directory/#\~/$HOME}"
        uncomment_directory "$directory"
        ;;
    3) # Undo
        read -e -p "File name: " filename
        filename="${filename/#\~/$HOME}"
        undo "$filename"
        ;;
    4) # Clean
        clean
        ;;
    *) # invalid
        echo "Invalid selection"
        ;;
esac
