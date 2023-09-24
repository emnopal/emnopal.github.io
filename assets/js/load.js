(function () {
	"use strict"; //preloader
	fetch("./assets/data/summary.json")
		.then((response) => response.json())
		.then((json) => {
			let summary = document.getElementById("summary-content");
			summary.innerHTML = `
                <h5>
                    ${json.summary}
                    <br/><br/>
                    ${json.additionalSummary}
                </h5>
            `;
		});
})();
