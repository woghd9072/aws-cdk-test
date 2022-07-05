def handle(event, context):
    print('event--------->', event)

    return {
        "statusCode" : 200,
        "headers" : {
            "Content-Type" : "application/json"
        },
        "body" : "{\n \"name\" : \"jaehong\" \n}"
    }