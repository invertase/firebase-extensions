## See it in action

You can test out this extension right away!

Depending on the task you want to run, add a new Firestore document to `${param:COLLECTION_PATH}`.

For example, if you want to run a text classification task using the model [`distilbert-base-uncased-finetuned-sst-2-english`](https://huggingface.co/distilbert-base-uncased-finetuned-sst-2-english), add a new document to `${param:COLLECTION_PATH}` with the following fields:

```
{
  "inputs": "You're amazing!"
}
```

The response will get written back to the same document.

```
{
  "inputs": "You're amazing!",
  "response": [
    {
      "label": "POSITIVE",
      "score": 0.9998762602806091
    },
    {
      "label": "NEGATIVE",
      "score": 0.00012373875781264198
    }
  ]
}
```

## Error handling

If the extension encounters an error, it will write the error message to the document in `${param:COLLECTION_PATH}`.

```
{
  "text": "You're amazing!",
  "error": "Field `inputs` must be provided and must be a string or a list of strings"
}
```

# Monitoring

As a best practice, you can [monitor the activity](https://firebase.google.com/docs/extensions/manage-installed-extensions#monitor) of your installed extension, including checks on its health, usage, and logs.
