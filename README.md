# file-organizer

file-organizer is a small Node.js command-line script that copies a messy folder of photos (or any other files) into a clean, date-based folder layout. It was written to tidy up a personal picture library where files from phones and cameras had piled up in nested folders with inconsistent names. When you run it, it asks for an input folder and an output folder, walks the input folder recursively, picks a date for each file from its filesystem timestamps (the earlier of the modification time and the status-change time), and copies the file into `<output>/<year>/<MM-MON>/` under a new name built from that date and time. The originals are never moved or deleted. It is a single `index.js` file with one dependency (`prompt`), has no tests, and is a one-off utility rather than a maintained tool.

> Status: single-commit personal utility. Not actively maintained.

## Features

- Interactive prompts for the input and output folders (no command-line flags).
- Recursively scans every subfolder of the input folder.
- Copies, never moves: the source folder is left untouched.
- Groups files as `<year>/<MM-MON>/`, for example `2019/07-JUL/`.
- Renames each file to `DD-MON-YYYY-HHMMSS.<ext>`, for example `14-JUL-2019-093512.jpg`, keeping the original extension.
- Skips a file if a file with the target name already exists, so re-running the script does not duplicate files.
- Logs a running counter with each copied or skipped file.

## Tech stack

Node.js · `fs` / `path` · [prompt](https://www.npmjs.com/package/prompt)

## Getting started

Prerequisites: Node.js and npm.

```bash
npm install
npm start
```

You will be asked for two paths:

```text
prompt: input:  C:\Users\me\Pictures
prompt: output: C:\Users\me\Pictures-Organized
```

The output folder is created if it does not exist.

## Example result

```text
Pictures-Organized/
├── 2018/
│   └── 12-DEC/
│       └── 24-DEC-2018-201455.jpg
└── 2019/
    ├── 01-JAN/
    │   └── 03-JAN-2019-110203.mp4
    └── 07-JUL/
        ├── 14-JUL-2019-093512.jpg
        └── 14-JUL-2019-093547.jpg
```

## Limitations

- The date comes from filesystem timestamps, not from EXIF metadata, so files that were copied or restored may get the copy date instead of the date the photo was taken.
- Every file is processed, not only images and videos.
- The file name has one-second resolution. If two different files share the same timestamp and extension, only the first is copied and the second is reported as `Skip`.
- There are no tests (`npm test` exits with an error).
