# 🛡️ Stellar Shield - Web3 Wallet Dashboard & Security Hub

Stellar Shield is a modern, user-friendly, and security-centric Web3 wallet dashboard (dApp) operating on the Stellar Testnet. This project has been developed for the **Rise In - Stellar Journey to Mastery (July Challenge)** to fully satisfy the **Level 1 - White Belt** requirements, while introducing innovative UX enhancements and proactive cyber security layers.

---

## 🎬 Project Demo Video


👉 <img width="800" height="362" alt="giflik-ezgif com-video-to-gif-converter" src="https://github.com/user-attachments/assets/ba733495-70da-4bdf-b8c1-ac04220cac1a" />

> 💡 **Want to see the full, uncut workflow?** > If you would like to watch the complete step-by-step wallet connection, multi-asset transfer processes, and live network confirmations in full detail, you can watch our comprehensive video here:  
> 👉 **[Click Here to Watch the Full Detailed Project Demo Video](https://drive.google.com/file/d/1Jq-IaFl-WjWYC3_TsS9b4zzIHt8Hi09H/view)**

---

## 🚀 Features:

* 🔐 **Multi-Wallet Integration:** Full integration with the official **Freighter** wallet, along with ecosystem simulation models for Albedo and xBull in a sandbox environment.
* 🛡️ **Smart Security Detector (Security Audit):** A native module performing real-time `SSL/TLS Connection Status` checks and running a `Wallet Injection Interceptor` shield to mitigate malicious extension exploits.
* 🔒 **Advanced Transaction & Risk Confirmation:** A two-stage confirmation modal triggered before signing transactions, presenting the user with a dedicated security risk analysis agreement checkbox.
* 💰 **Dynamic Balance & Base Fee Tracking:** Fetches the connected wallet's live Testnet XLM balance and the network's current minimum gas fee (Base Fee) dynamically via API.
* 📈 **Live Asset Flow Chart (Recharts):** An interactive dynamic Area Chart enabling users to track asset fluctuations and balance changes immediately after transfers.
* 💸 **Multi-Asset Transfer Panel:** Easily switch between `XLM`, `USDC`, and `EURC` token supports to execute secure Testnet transfers using the recipient's Public Key.
* 📇 **Integrated Address Book:** Save frequently used addresses, secure vaults, or jury test wallets to initiate accurate transfers with a single click.
* 🔍 **Instant Search & Filtering:** Case-insensitive, real-time query filter within the Transaction History tab using wallet addresses or Transaction Hashes (Tx Hash).
* 📱 **Full Mobile Responsiveness:** Designed using Tailwind CSS breakpoints (`flex-col md:flex-row`) to ensure a flawless, adaptable layout across mobile, tablet, and desktop viewports.
* 🔲 **Dynamic QR Code Engine:** Generates a custom QR code matching the connected user's Public Key for error-free, quick peer-to-peer payment requests.

---

## 🛠️ Installation & Local Setup

Follow these steps to run the project locally on your machine:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/stellar-shield.git
   cd stellar-shield
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Development Server:**
    ```bash
    npm start
    ```
    Your browser will automatically open the project at http://localhost:3000 .

---

## 📸 Submission Proofs

💡 Jury Evaluation Note: The mandatory visual proofs requested in the Submission Checklist are mapped directly below.

1. Wallet Connected State & Balance Displayed
Proof of successful Freighter extension connection showing the active account state alongside the retrieved live Testnet balances:

<img width="1918" height="866" alt="dashboard" src="https://github.com/user-attachments/assets/fbb7a97c-1b88-4c59-89e4-8a8ee8274f76" />

2. Successful Testnet Transaction
The active transaction signing state via the Freighter extension, executing a secure operation on the Stellar Testnet:

<img width="1126" height="476" alt="transfer" src="https://github.com/user-attachments/assets/0896c76b-4705-43ca-bb51-3fa4aa4a173d" />
<img width="442" height="405" alt="security_confirm" src="https://github.com/user-attachments/assets/6cb1cdb0-81b9-40fb-b5fa-e891ecb03091" />
<img width="435" height="778" alt="freighter" src="https://github.com/user-attachments/assets/65c9adf6-7c5e-4fb8-94f3-a8a59c4fc475" />

3. Transaction Result Shown to the User
The dynamic success UI notifying the user with the final network operation status and exposing the verifiable Tx Hash code:

<img width="916" height="456" alt="send1" src="https://github.com/user-attachments/assets/53ab2c96-e98e-4b66-adbe-dcf1ebb657fa" />

4. Dynamic QR Code Component (Bonus Feature)
Real-time peer-to-peer payment address sharing interface driven by the user's active public key:

<img width="750" height="567" alt="qr kod" src="https://github.com/user-attachments/assets/76137057-50d0-4322-8450-d5622445e9a5" />

5. Multi-Asset Transfer & Search Filter (Bonus Features)
The multi-asset ecosystem panel integrated with instant text-filtering logic for historical ledger searches:

<img width="927" height="290" alt="Transaction-History" src="https://github.com/user-attachments/assets/5e091cf9-6d10-49e7-a63f-3b7a294da6df" />

---

🗺️ Future Roadmap

WalletConnect & Deep Linking: Integrating WalletConnect infrastructure to streamline mobile app interactions, allowing users to scan the dApp QR code to seamlessly trigger LOBSTR or Vibrant mobile wallet approvals.

Live Phishing Registry: Connecting the native Security Detector to global malicious-address API databases to instantly display critical red alerts if a user attempts a transfer to a blacklisted malicious wallet.


🧬 Tech Stack
Frontend: React.js (JavaScript / JSX)

Styling: Tailwind CSS (Fully Responsive Layout)

Icons: Lucide React

Charts: Recharts

Stellar SDK: @stellar/freighter-api
