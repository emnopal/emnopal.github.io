Date.locale = {
	en: {
		month_names: [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		],
		month_names_short: [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		],
	},
};

Date.prototype.getMonthName = function (lang) {
	lang = lang && lang in Date.locale ? lang : "en";
	return Date.locale[lang].month_names[this.getMonth()];
};

Date.prototype.getMonthNameShort = function (lang) {
	lang = lang && lang in Date.locale ? lang : "en";
	return Date.locale[lang].month_names_short[this.getMonth()];
};

function monthDiff(dateFrom, dateTo) {
	const numMonth =
		dateTo.getMonth() -
		dateFrom.getMonth() +
		12 * (dateTo.getFullYear() - dateFrom.getFullYear());

	const numYear = parseInt(numMonth / 12);
	if (numYear >= 1) {
		const remainderMonth = numMonth % 12;
		const pluralYear = numYear > 1 ? "years" : "year";
		const pluralMonth = remainderMonth > 1 ? "months" : "month";
		return `${numYear} ${pluralYear} ${remainderMonth} ${pluralMonth}`;
	}

	const pluralMonth = numMonth > 1 ? "months" : "month";
	return `${numMonth} ${pluralMonth}`;
}

async function renderSummary() {
	try {
		const response = await fetch("./assets/data/summary.json");
		if (!response.ok) {
			throw new Error(`Failed to fetch data: ${response.status}`);
		}

		const json = await response.json();

		let summary = document.getElementById("summary-content");
		summary.innerHTML = `
            <h5>
                ${json.summary}
                <br/><br/>
                ${json.additionalSummary}
            </h5>
        `;
	} catch (error) {
		console.error("An error occurred:", error);
	}
}

async function renderExperience() {
	try {
		const response = await fetch("./assets/data/experience.json");
		if (!response.ok) {
			throw new Error(`Failed to fetch data: ${response.status}`);
		}

		const json = await response.json();

		let data = "";
		json.forEach((ele) => {
			let parseDateStart = new Date(ele.Date.Start);
			let parseMonthStart = parseDateStart.getMonthNameShort("en");
			let parseYearStart = parseDateStart.getFullYear();
			let parseDateStartString = `${parseMonthStart} ${parseYearStart}`;

			let parseDateEnd = ele.Date.End
				? new Date(ele.Date.End)
				: new Date();
			let parseMonthEnd = parseDateEnd.getMonthNameShort("en");
			let parseYearEnd = parseDateEnd.getFullYear();
			let parseDateEndString = ele.Date.End
				? `${parseMonthEnd} ${parseYearEnd}`
				: "Present";

			let countExperience = monthDiff(parseDateStart, parseDateEnd);

			data += `
                <div class="column col-12 text-left" style="padding-bottom: 35px">
                    <h3>${ele.Title}</h3>
                    <h6>${ele.CompanyName} &#x2022 ${ele.ExperienceType} </h6>
                    <h6>${parseDateStartString} - ${parseDateEndString} (${countExperience})</h6>
                    <div style="padding-top: 10px;">
                        <span>${ele.Description}</span>
                    </div>
                    <div style="padding-top: 15px; border-bottom: 3px solid black"/></div>
                </div>
            `;
		});

		let summary = document.getElementById("experience-content");
		summary.innerHTML = `
            <div class="row">
                ${data}
            </div>
        `;
	} catch (error) {
		console.error("An error occurred:", error);
	}
}

// render to html
(async function () {
	"use strict"; //preloader

	// make sure experience date start and end always up to date
	async function updateExperience() {
		await renderExperience();
		setTimeout(updateExperience, 5000);
	}

	renderSummary();
	updateExperience();

})();
