# XSLT Debugger for VSCode

This is **alpha**.

![xslt-debugger](https://user-images.githubusercontent.com/253202/76785314-383b2b80-6783-11ea-9d49-6e952757c098.gif)


## Steps to run

1. Run `npm install` in this repo
1. Run [./build.bash](./build.bash) to make sure the XSLT jar is available
1. Open up the repo in VSCode and press <kbd>F5</kbd> to start a development instance of VSCode
1. Open a directory in the dev VSCode with an XSLT file and an input XML file
1. Create a launch config that has this in it:

```js
{
  "configurations": [
    {
      "type": "mock",
      "request": "launch",
      "name": "Debug XSLT Files",
      "program": "${workspaceFolder}",
      "classPaths": [
        "{insert_absolute_path_to_the_xsl_file}.xsl",
        "{insert_absolute_path_to_the_input_file}",
        "{insert_absolute_path_to_the_output_file}"
      ]
    }
  ]
}

