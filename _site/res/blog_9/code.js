Survey
    .StylesManager
    .applyTheme("default");
$("audio").on("play", function() {
    $("audio").not(this).each(function(index, audio) {
        audio.pause();
    });
});
var json = {
    questions: [
        {
            type: "html",
            name: "info",
            html: "<audio src='Gray_noise.mp3' controls preload='auto' controls='controls'></audio>"
        }
    ]
};

window.survey = new Survey.Model(json);

survey
    .onComplete
    .add(function (result) {
        document
            .querySelector('#surveyResult')
            .innerHTML = "result: " + JSON.stringify(result.data);
    });

$("#surveyElement").Survey({model: survey});
