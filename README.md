# Havenwise deployment notes

This fork serves `tariff.havenwise.co.uk` from Netlify (`netlify.toml`), and that is the page the Havenwise app opens today. **Anything merged to `main` goes live for every app build in the field.** The GitHub workflow also deploys `fly-staging.toml` on a push to `main`.

## Outcome message for the app (HAV-1039)

- The app mints a single-use connect token with `POST /tariff/token` on havenwise-api and opens `/?fp_cot=<token>`. That token is the page's only credential.
- **Legacy (no extra parameter):** behaviour is unchanged. On `session_redirect` the page navigates to the havenwise-api callback, which links the tariff and posts the bare string `"close"`. On `complete_tariff` it posts `{"action":"close","fp_cot":...}`.
- **`&outcome=message` (new app builds):**
  - On `session_redirect` the page fetches the callback in the background instead of navigating to it.
  - When the flow finishes, it posts exactly one JSON message: `{"status":"connected"|"failed","tariff":{"name","supplier","varies"}|null}`. It goes over `window.ReactNativeWebView.postMessage`, and also over `window.parent.postMessage` when the page is in an iframe.
  - `connected` means Flatpeak finished with a tariff and the callback was reached. It does **not** prove Havenwise linked the tariff, because the callback always answers 200. The app confirms the link by re-reading `GET /buildings/{id}/suggestions`.
  - `varies` is false only for a `FIXED` structure.
  - Errors are not a finish: the error view offers "Try again". Closing the page posts nothing.
  - On `complete_tariff` the legacy `{"action":"close"}` message is still sent as well, so the app should act only on messages carrying `status`.

---

# Flatpeak Connect web

The Flatpeak Connect web app is the open source reference implementation of the Flatpeak Connect experience. It shows how to embed tariff connection inside your own product and helps developers understand the full flow from start to completion.

Flatpeak Connect allows your customers to connect their energy tariff directly from your app. Once connected, Flatpeak retrieves real time electricity prices for each customer address and returns them through a simple API.

---

## Getting started

To integrate Flatpeak Connect into your product, follow the official guide in our developer documentation.

[Flatpeak Connect guide](https://docs.flatpeak.com/)

---

## Repository structure

This repository contains:

- The public Flatpeak Connect web client  
- An example implementation of the Connect flow  
- Reference components for partners  
- Build and development configuration  

The codebase is production ready and can be forked, customised, or used to inspire your own Connect UI.

---

## Contributing

We welcome contributions. If you encounter a bug or have a feature request, open an issue or submit a pull request.

Please review existing discussions before submitting new items.

---

## License

The Flatpeak Connect web app is licensed under the MIT License.  
Copyright (c) 2025 Flatpeak.

[MIT License](https://opensource.org/licenses/MIT)

---

## About Flatpeak

Flatpeak is the ground truth energy data platform trusted by global OEMs. We provide real time electricity prices for every customer address, enabling devices to schedule, optimise, and report energy use with clarity and precision.

Flatpeak Connect is maintained and funded by Flatpeak Technology Ltd.  
Flatpeak names and logos are trademarks of Flatpeak.

---

<img
  src="https://framerusercontent.com/images/6vt6k0NokCKASMb6ch6m5fhc2yY.svg?width=128&height=32"
  alt="Flatpeak logo"
/>

---

If you have ideas for improvement, feel free to open issues or create pull requests in this repository.