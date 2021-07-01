$(document).ready(function(){
    console.log("script loaded!");
    var ans=[];
    var userAns=[],count=0;
    function optionsClicked(name,value){
        name=Number(name);
        value=Number(value);
        if(ans.length>0){
            for(var k=0;k<ans.length;k++){
                if((ans[k].id==name)){
                    ans[k].answer=value;
                }
                else{
                    ans.push({
                        id:name,
                        answer:value,   
                    })
                }
            }
        }else if(ans.length==0){
            ans.push({
                id:name,
                answer:value,
            })
        }
    }
    function userAnswers(){
        function compare(val1,val2){
            if(val1.id<val2.id){
                return -1;
            }else if(val1.id>val2.id){
                return 1;
            }else{
                return 0;
            }
            }

            if(ans.length==0){
                return 0;
            }else{
                ans.sort(compare);
            }
            
            
            for(var i=0;i<ans.length-1;i++){
                if(ans[i].id!=ans[i+1].id){
                    userAns[count++]=ans[i];
                }
            }
            userAns.push(ans[ans.length-1]);
            return userAns;
    }
    $.get("https://5d76bf96515d1a0014085cf9.mockapi.io/quiz",
     function(response){
        for(var i=0;i<response.length;i++){
            var QuizWrapper=$("<div>");
            QuizWrapper.addClass("line");
            var Question=$("<h3>").text("Q"+response[i].id+"."+response[i].question);
            Question.addClass("Quiz-question");
            $("#Quiz-data").append(QuizWrapper);
            QuizWrapper.append(Question);
            for(var j=0;j<response[i].options.length;j++){
                var Input=$("<input>").attr("type","radio").attr("id","option"+(j+1)+"Q"+(i+1)).attr("name","Question"+(i+1)).attr("value",j+1);
                Input.addClass("radio-button");
                var Label=$("<label>").attr("for","option"+(j+1)+"Q"+(i+1)).text(response[i].options[j]);
                Label.addClass("Quiz-options");
                QuizWrapper.append(Input,Label,$("<br>"));
                
                $(Input).click(function(){
                    var optionName=$(this).attr("name");
                    optionName=optionName.split("n");
                    optionName=optionName[1];
                    optionsClicked(optionName,$(this).attr("value"));
                     
                })
            }
        }
        var results=0;
        $("#results").text(results+"/"+response.length);
        $("#submit-btn").click(function(){
            var forvalidation=userAnswers();
                results=forvalidation.length;
                
                for(var i=0;i<response.length;i++){
                    for(var j=0;j<response[i].options.length;j++){
                        var inputradio=document.getElementById("option"+(j+1)+"Q"+(i+1));
                        var lableForCorrectOption=document.getElementsByTagName("label");
                        var name=inputradio.name;
                        name=name.split("n");
                        name=name[1];
                        var value=inputradio.value
                        name=Number(name);
                        value=Number(value);
                        if(response[i].answer==inputradio.value){
                            var correctAnswers=inputradio.id;
                            var correct=document.createElement("i");
                            correct.className="fas fa-check correct-icon";
                            for(var l=0;l<lableForCorrectOption.length;l++){
                                if(lableForCorrectOption[l].htmlFor==correctAnswers){
                                    lableForCorrectOption[l].appendChild(correct);
                                }
                            }
                        }
                        if(forvalidation!=0){
                            for(var k=0;k<forvalidation.length;k++){
                                if(forvalidation[k].id===name){
                                    if(forvalidation[k].answer===value){
                                        inputradio.setAttribute("checked","true");
                                        if(forvalidation[k].id==response[i].id){
                                            if(forvalidation[k].answer!=response[i].answer){
                                                var wrong=document.createElement("i");
                                                wrong.className="fas fa-times wrong-icon";
                                                for(var l=0;l<lableForCorrectOption.length;l++){
                                                    if(lableForCorrectOption[l].htmlFor==inputradio.id){
                                                        lableForCorrectOption[l].appendChild(wrong);
                                                        results--;
                                                    }
                                                }
                                            }
                                        }
                                    }else if(!(inputradio.checked)){
                                        inputradio.setAttribute("disabled","true");
                                    }
                                }else if(!(inputradio.checked)){
                                    inputradio.setAttribute("disabled","true");
                                }
                            }
                        }else{
                            results=0;
                            inputradio.setAttribute("disabled","true");
                        }
                    }
                }
            $("#submit-btn").css({
                "display":"none"
            })
            $("#results").text(results+"/"+response.length);
        })
        $("#Quiz-form").submit(function(e){
        e.preventDefault();
        });
    });
    
});