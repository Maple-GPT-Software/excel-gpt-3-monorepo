import openai
from django.http import HttpResponse


def completion(request):
    if request.method == "POST":
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=request.body.decode("utf-8"),
            max_tokens=50
        )

        #print(response.choices[0].text.split("=", 1)[1])
        return HttpResponse("FORMULA=" + response.choices[0].text.split("=", 1)[1] + "%END%")


def generate_prompt():
    return provide_context(False) + """
        I have a the following data table, how do I figure out if the emails are properly formatted?
        Range: A1:D5
        Data table:
        Name,Height,Eye color,Email
        Kyle Stone,4.48,red,kyle.stone@gmail.com
        Reese Reilly,4.61,blue,r.reilly@hotmail.com
        Kaia Bray,5.92,green,kaia.br@asdç
        Landin Cowan,4.44,brown,landin@outlook.ca"""


def provide_context(verbose: bool):
    return "In the context of Google Sheets, can you provide me with just the formula that I have to insert for the following?"
