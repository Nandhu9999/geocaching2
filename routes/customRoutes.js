const axios = require('axios');

async function executeLLM(request, reply){
    const {service, model, prompt} = request.body
    console.log(">> service:",service)
    const {data} = await axios.post(service, {model,prompt}, {
        headers: {'Content-Type': 'application/json'}
    })
    return reply.send(data)
}

module.exports = {
    executeLLM
}