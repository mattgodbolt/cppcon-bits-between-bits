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

        for (let element of document.querySelectorAll('pre code')) {
            if (element.hasAttribute('data-snippet')) {
                xhrGet("snippets/" + element.getAttribute('data-snippet'))
                    .then((res) => {
                        element.innerText = res;
                    });
            }
        }
    }
)();