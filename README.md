# To run
- Set the .env file with the parameters:
    ```
    SECRET_KEY=ctf-secret-key
    REGISTRATION_OPEN=true # If set to false, the registration is closed despite the deadline
    GOOGLE_FORM_URL=https://forms.gle/your_actual_form_link
    PORT=4000
    ```
> Note: If env file is changed, the server is to be run again for the changes to be visible.
- Create a venv:
    ```
    python -m venv .venv
    ```
- Install the dependencies
    ```
    pip install -r requirements.txt
    ```

- Start the server
    ```
    python app.py
    ```