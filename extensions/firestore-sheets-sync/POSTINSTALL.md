### Before you can use this extension

You need to allow the extension service account to edit the Google Sheet you want to sync with Firestore.

1.  Open the Google Sheet you want to sync with Firestore.
2.  In the top right, click **Share**.
3.  Add the extension service account as an editor.

    The extension's service account is:

    ```
    ext-${param:EXT_INSTANCE_ID}@extensions-testing.iam.gserviceaccount.com
    ```

You're good to go!

