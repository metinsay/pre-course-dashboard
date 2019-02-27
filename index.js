$(function () {
    // And for a doughnut chart
    const data1 = {
        datasets: [{
            data: [],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
            ],
        }],
        labels: [
            'Viewed',
            'Not viewed',
        ]
    }
    const data2 = {
        datasets: [{
            data: [],
            backgroundColor: [
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)',
            ],
        }],
        labels: [
            'Certified',
            'Not Certified',
        ]
    }
    const course = $('#cid');
    const gender = $('#gender');
    const edu = $('#edu');
    const country = $('#country');
    const age = $('#age');
    $('.ui.dropdown').dropdown();
    const chart1 = document.getElementById('chart1');
    const chart2 = document.getElementById('chart2');
    chart1.height = 200;
    chart2.height = 200;
    var view = new Chart(chart1, {
        type: 'doughnut',
        data: data1,
        options: {},
    });
    var certif = new Chart(chart2, {
        type: 'doughnut',
        data: data2,
        options: {},
    });
    setTimeout(() => {
        $.getJSON('/data.json', function (data) {
            const db = TAFFY(data);
            $('.ui.dropdown').dropdown({
                onChange: () => {
                    update(db);
                }
            });
            update(db);
        });
    }, 1000);
    function update(db) {
        const query = {};
        const courses = course.dropdown('get value');
        if (courses.length > 0) {
            query.course_id = courses;
        }
        const genders = gender.dropdown('get value');
        if (genders.length > 0) {
            query.gender = genders;
        }
        const edus = edu.dropdown('get value');
        if (edus.length > 0) {
            query.education = edus;
        }
        const locs = country.dropdown('get value');
        if (locs.length > 0) {
            query.location = locs;
        }
        const ages = age.dropdown('get value');
        if (ages.length > 0) {
            query.age_group = ages;
        }

        const results = db(query);
        const total = results.count();
        const viewed = results.sum('viewed');
        const certified = results.sum('certified');
        view.data.datasets[0].data = [viewed, total - viewed];
        certif.data.datasets[0].data = [certified, total - certified];
        view.update();
        certif.update();
    }
});
