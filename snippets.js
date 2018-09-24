(
    function () {
        function xhrGet(url) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", url);
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300)
                        resolve(xhr.response);
                    else
                        reject(xhr.statusText);
                };
                xhr.onerror = () => reject(xhr.statusText);
                xhr.send();
            });
        }

        const tabsRe = /\t/g;

        function expandTabs(line, size) {
            let extraChars = 0;
            const padding = (() => {
                let res = "";
                for (let i = 0; i < size; ++i) res += " ";
                return res;
            })();
            return line.replace(tabsRe, function (match, offset) {
                const total = offset + extraChars;
                const spacesNeeded = (total + size) % size;
                extraChars += spacesNeeded - 1;
                return padding.substr(spacesNeeded);
            });
        }

        function postProcess(text, highlight) {
            highlight = new RegExp(highlight ? highlight : "^this should not match anything$^");
            let lastBlank = true;
            return text
                .replace(/</g, "&lt;").replace(/>/g, "&gt;")
                .split("\n")
                .filter(x => {
                    const thisBlank = x.trim() === "";
                    const shouldSkip = lastBlank && thisBlank;
                    lastBlank = thisBlank;
                    return !shouldSkip;
                })
                .map(x => expandTabs(x, 2))
                .map(x => {
                    if (highlight.test(x))
                        return "<span class=\"highlighted-already\">" + x + "</span>";
                    else
                        return x;
                })
                .join("\n");
        }

        for (let element of document.querySelectorAll('pre code')) {
            if (element.hasAttribute('data-snippet')) {
                xhrGet("snippets/" + element.getAttribute('data-snippet'))
                    .then((res) => {
                        element.innerHTML = postProcess(res, element.getAttribute('data-snippet-highlight'));
                        if (typeof(window.hljs) === "function") {
                            window.hljs.highlightBlock(element);
                        }
                    });
            }
        }
    }
)();