// ===== UTILS =====
function wait(ms) {
    return new Promise(res => setTimeout(res, ms));
}

function getXPath(xpath) {
    return document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;
}

function waitForXPath(xpath, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();

        const timer = setInterval(() => {
            const el = getXPath(xpath);
            if (el) {
                clearInterval(timer);
                resolve(el);
            }
            if (Date.now() - start > timeout) {
                clearInterval(timer);
                reject("⛔ Timeout XPath: " + xpath);
            }
        }, 200);
    });
}

// ===== LOGIC CLICK SỐ =====
async function clickDigitSequence(code) {
    console.log("🔢 Bắt đầu nhập:", code);

    for (let i = 1; i <= code.length; i++) {
        const digit = code[i - 1];

        const btnXpath = `//button/div/div/div[text()='${digit}']`;
        const btn = await waitForXPath(btnXpath);

        btn.click();
        console.log("👉 Bấm số:", digit);

        const expected = code.substring(0, i);
        const checkXpath = `//div[contains(@class,"codeContainer")]/code[contains(text(),"${expected}")]`;

        await waitForXPath(checkXpath);
        console.log("✔ Đã xuất hiện:", expected);

        await wait(500);
    }

    const enterBtn = await waitForXPath(`//img[@alt="enter"]`);
    enterBtn.click();

    console.log("🚀 Đã nhấn ENTER");
}

// ===== MAIN =====
(async () => {
    const result = prompt("Nhập 6 số captcha:");

    if (!result || result.length !== 6) {
        console.log("❌ Bạn phải nhập đúng 6 số!");
        return;
    }

    console.log("🟢 Bạn nhập:", result);
    await clickDigitSequence(result);
})();
