# Gitbook plugin watch

Add more files and folders to watch for file changes that trigger's rebuild of the gitbook when running `gitbook serve`.

## How to use it?

To use the watch plugin in your Gitbook project, add the watch plugin to the book.json file, then install plugins using gitbook install.

Setup files to watch in `pluginsConfig.watch.files`.

```json
{
    "plugins": ["watch"],
    "pluginsConfig": {
        "watch": {
            "files": [
                "./assets/**/*"
            ]
        }
    }
}
```
