Afrikiko Equal Pay
> A smart, region-specific bill splitter designed for the Ghanaian dining context.
> Developed by MR. WETTA

![Project Status](https://img.shields.io/badge/Status-Live-success)
![Tech](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JS-gold)
![Mobile](https://img.shields.io/badge/Mobile-Responsive-blue)

[Live Demo](https://emwetta.github.io/Bill-and-Tip-Splitter/)
Click the link above to test the live application.


About The Project
Afrikiko Equal Pay is a web application developed to solve a common social problem: splitting restaurant bills accurately among friends, while handling local
payment nuances like Mobile Money (MoMo) and Cash.
Unlike generic splitters, this tool is tailored for the Ghanaian market, featuring strict MoMo number validation, custom tip distribution, 
and direct WhatsApp integration for collecting payments.

Key Features
1. Smart Bill Splitting
- Splits the base bill equally among the group.
- Allows for **Custom Tip Contributions** (e.g., Kofi pays 20, Ama pays 180).
- Validates that tip contributions match the total tip amount.

2. 🇬🇭 Ghana-Specific Payment Logic
- Toggle between Cash & Mobile Money.
- Strict Validation: Accepts only valid Ghana numbers (10 digits, starting with `02` or `05`).
- Prevents invalid characters and auto-formats the input.

3. WhatsApp Integration
- Generates a formatted financial breakdown.
- One-click **"Share on WhatsApp"** button.
- Includes the **Collector's Name & MoMo Number** directly in the message for easy transfers.

4.Auto-Save (Local Storage)
- Never lose data. The app saves names, amounts, and settings to the phone's memory in real-time.
- Restores the session automatically if the browser is closed or refreshed.

5. Premium UI/UX
- Dark Mode: High-contrast Black & Gold theme.
- Responsive: Works perfectly on iPhones, Androids, and Desktops.
- PWA Ready: Can be installed to the home screen as a native app.



Technologies Used
* Frontend: HTML5, CSS3 (Custom Properties), Vanilla JavaScript (ES6+).
* Libraries:
    * [SweetAlert2](https://sweetalert2.github.io/) (For beautiful, customized popups).
    * [Animate.css](https://animate.style/) (For smooth UI transitions).
* Deployment: GitHub Pages.

How to Run Locally
If you want to clone and modify this project:
1.  Clone the repository
    bash
    git clone [https://github.com/emwetta/Bill-and-Tip-Splitter.git](https://github.com/emwetta/Bill-and-Tip-Splitter.git)

2.  Open the folder
    bash
    cd Bill-and-Tip-Splitter
    
3.  Launch
    Open `index.html` in your browser or use Live Server in VS Code.


 Author
MR. WETTA
 GitHub: [@emwetta](https://github.com/emwetta)

Enjoy using Afrikiko Equal Pay! 
