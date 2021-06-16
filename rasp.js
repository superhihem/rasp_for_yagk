const http = require("http");
const cheerio = require("cheerio");


let headers = {
    "Группа" : 2,
    "Номер" : 3,
    "Расписание" : 4,
    "Замена" : 5,
    "Аудитория": 6
};

function set_headers(object){
    headers = object;
}



function cell(el, $){
    let cl = {};
    Object.keys(headers).forEach(header => {
        cl[header] = $(el).find("td:nth-child("+headers[header]+")").text();
    });

    return cl;
}

function parse(callback, params = {}){
    let data = [];
    let group = params.group || "all";
    let sort_by = params.sort_by || "Группа";
    get_page(page1 => {
        const $ = cheerio.load(page1);

        if(group == "all"){
            $("table tr").each(function(){
                if($(this).find("td:nth-child(2)").text() != "" && $(this).find("td:nth-child(2)").text() != "Группа")
                data.push(cell(this, $));
            });
        }else{
            $("table tr").each(function(){
                if($(this).find("td:nth-child(2)").text() == group)
                data.push(cell(this, $));

                //console.log("group set", $(this).find("td:nth-child(2)").text())
            });
        }

        get_page(page2 => {
            const $_ = cheerio.load(page2);

            if(group == "all"){
                $_("table tr").each(function(){
                    if($_(this).find("td:nth-child(2)").text() != "" && $_(this).find("td:nth-child(2)").text() != "Группа")
                    data.push(cell(this, $_));
                });
            }else{
                $_("table tr").each(function(){
                    if($_(this).find("td:nth-child(2)").text() == group)
                    data.push(cell(this, $_));

                    //console.log("group set", $_(this).find("td:nth-child(2)").text())
                });
            }
            

            data.sort((a, b) => {
                if(a[sort_by] > b[sort_by]){
                    return 1;
                }
                if(a[sort_by] == b[sort_by]){
                    return 0;
                }
                if(a[sort_by] < b[sort_by]){
                    return -1;
                }
            })

            callback(data);
        }, "http://ftp.sttec.yar.ru/pub/timetable/rasp_second.html");

    }, "http://ftp.sttec.yar.ru/pub/timetable/rasp_first.html");
};


function get_page(callback, url){
    let data = "";
    http.get(url, resp => {
        resp.on("data", ch => { 
            data += ch; 
        });
    
        resp.on("end", () => {
            callback(data);
        });
    });
}

parse(()=>{})

module.exports.parse = parse;
module.exports.headers = set_headers;