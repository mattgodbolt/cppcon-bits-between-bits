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
                let res = ""
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

        function postProcess(text) {
            const MaxLength = 70;
            let lastBlank = true;
            return text
                .split("\n")
                .filter(x => {
                    const thisBlank = x.trim() === "";
                    const shouldSkip = lastBlank && thisBlank;
                    lastBlank = thisBlank;
                    return !shouldSkip;
                })
                .map(x => expandTabs(x, 2))
                .map(x => x.length >= MaxLength ? x.substr(0, MaxLength - 3) + "..." : x)
                .join("\n");
        }

        for (let element of document.querySelectorAll('pre code')) {
            if (element.hasAttribute('data-snippet')) {
                xhrGet("snippets/" + element.getAttribute('data-snippet'))
                    .then((res) => {
                        element.innerText = postProcess(res);
                    });
            }
        }
    }
)();