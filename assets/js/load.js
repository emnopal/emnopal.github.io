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
		json.forEach((ele, num) => {
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

			let borderBottomClass = num < 2
				? "padding-bottom: 15px;"
				: "padding-bottom: 15px; padding-top: 35px;"

			data += `
                <div class="column col-12 text-left" style="${borderBottomClass}">
                    <h3>${ele.Title}</h3>
                    <h6>${ele.CompanyName} &#x2022 ${ele.ExperienceType} </h6>
                    <h6>${parseDateStartString} - ${parseDateEndString} (${countExperience})</h6>
                    <div style="padding-top: 10px;">
                        <span>${ele.Description}</span>
                    </div>
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
	setTimeout(renderExperience, 5000);
}

async function renderEducation() {
	try {
		const response = await fetch("./assets/data/education.json");
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

			let isUniv
			if (ele.Thesis && ele.GPA) {
				isUniv = `
					<div style="padding-top: 10px;">
						<h6>Thesis: ${ele.Thesis} (<a href="https://repository.uinjkt.ac.id/dspace/handle/123456789/63813" target="_blank" >Thesis Publication</a>, <a href="https://github.com/emnopal/skin-lesion-detection" >Thesis Repository</a>)</h6>
						<h6>GPA: ${ele.GPA} (<a href="./assets/docs/Muhammad Naufal - ${ele.Degree} of ${ele.Major} Academic Report.pdf" target="_blank" >Academic Report</a>)</h6>
                    </div>
				`
			}

			let isActivity
			if (ele.Activity) {
				ele.Activity.forEach((acEle) => {
					let parseDateStartActivity = new Date(acEle.Organization.Date.Start);
					let parseMonthStartActivity = parseDateStartActivity.getMonthNameShort("en");
					let parseYearStarActivity = parseDateStartActivity.getFullYear();
					let parseDateStartActivityString = `${parseMonthStartActivity} ${parseYearStarActivity}`;

					let parseDateEndActivity = acEle.Organization.Date.End
						? new Date(acEle.Organization.Date.End)
						: new Date();
					let parseMonthEndActivity = parseDateEndActivity.getMonthNameShort("en");
					let parseYearEndActivity = parseDateEndActivity.getFullYear();
					let parseDateEndActivityString = acEle.Organization.Date.End
						? `${parseMonthEndActivity} ${parseYearEndActivity}`
						: "Present";

					let countExperienceActivity = monthDiff(parseDateStartActivity, parseDateEndActivity);
					isActivity = `
						<div style="padding-top: 10px;">
							<h6>Organization:</h6>
							<span>${acEle.Organization.Name}</span><br/>
							<span>${parseDateStartActivityString} - ${parseDateEndActivityString} (${countExperienceActivity})</span><br/>
							<span>Position: ${acEle.Organization.Position}</span>
						</div>
					`
				})
			}

			data += `
                <div>
                    <h3>${ele.Major}</h3>
                    <h6>${ele.School} &#x2022 ${ele.Degree} of ${ele.Major} </h6>
                    <h6>${parseDateStartString} - ${parseDateEndString} (${countExperience})</h6>
                    <div style="padding-top: 10px;">
                        <span>${ele.Description}</span>
                    </div>
					${isUniv}
					${isActivity}
                </div>
            `;
		});

		let summary = document.getElementById("education-content");
		summary.innerHTML = `${data}`;
	} catch (error) {
		console.error("An error occurred:", error);
	}
	setTimeout(renderEducation, 5000);
}

async function renderHardSkills() {
	try {
		const response = await fetch("./assets/data/skills.json");
		if (!response.ok) {
			throw new Error(`Failed to fetch data: ${response.status}`);
		}

		const json = await response.json();

		const HardSkills = json.HardSkills

		let data = '';
		let skillCount = 0;

		Object.keys(HardSkills).forEach((skillType) => {
			data += `
				<span>
					<h5 style="display: inline;">${skillType}</h5>
					<span style="display: inline;"> (Count: ${HardSkills[skillType].length})</span>
				</span>
			`
			HardSkills[skillType].forEach((skill) => {
				data += `
					<div class="col-lg-2 col-md-3 col-sm-4 col-6 mt-4 d-flex justify-content-center aos-init aos-animate" data-aos="zoom-in" data-aos-delay="100">
						<div class="icon-box iconbox-blue text-center">
							<div class="icon">
								<img src="assets/img/skill-icon/${skill}.png" alt="" height="60px" style="max-width: 100%; max-height: 100%;">
							</div>
							<br/>
							<h5>${skill}</h5>
							<p></p>
						</div>
					</div>
				`
				skillCount++
			})
		})

		let content = document.getElementById("skills-content");

		content.innerHTML = `
            <div class="row">
                ${data}
            </div>
        `

		let countSkills = document.getElementById("count-skills");
		countSkills.innerHTML = `${skillCount}`

	} catch (error) {
		console.error("An error occurred:", error);
	}
}

async function renderCertificates() {
	try {
		const response = await fetch("./assets/data/certificates.json");
		if (!response.ok) {
			throw new Error(`Failed to fetch data: ${response.status}`);
		}

		const json = await response.json();

		let data = "";
		json.forEach((ele, num) => {
			let borderBottomClass = num < 2
				? "padding-bottom: 15px;"
				: "padding-bottom: 15px; padding-top: 35px;"

			let textAlignLoc = num % 2 == 0 ? "text-right" : "text-left"

			data += `
                <div class="column col-12 ${textAlignLoc}" style="${borderBottomClass}">
                    <a href="${ele.certificationURL}" target="_blank"><h4>${ele.name}</h4></a>
                    <span>Issued by: ${ele.whoIssue} (${ele.issuedAt})</span><br/>
					<span>Certification No: ${ele.credentialsId}</span>
                </div>
            `;
		});

		let certificates = document.getElementById("certificates-content");
		certificates.innerHTML = `
            <div class="row">
                ${data}
            </div>
        `;

		let countCertificates = document.getElementById("count-certificates");
		countCertificates.innerHTML = `${json.length}`;

	} catch (error) {
		console.error("An error occurred:", error);
	}
	setTimeout(renderExperience, 5000);
}

// render to html
(async function () {
	"use strict"; //preloader

	renderSummary();
	renderExperience();
	renderEducation();
	renderHardSkills();
	renderCertificates();

})();
