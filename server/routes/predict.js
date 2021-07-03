const tf = require('@tensorflow/tfjs-node');

const predictDigit = async(imageArr) => {
    model = await tf.loadLayersModel('file://server/ml-models/model.json');
    console.log("in predict method", tf.reshape(imageArr, [28, 28]).shape);
    let predictedValues = model.predict(tf.reshape(imageArr, [1, 28, 28]));
    return(predictedValues.as1D().argMax().dataSync()[0]);
}


module.exports = (app) => {
    app.post(`/image/upload-json`, async (req, res) => {
        console.log("reached function");
        let prediction = await predictDigit(req.body);
        return res.send({ message: "Model was able to successfully predict digit", result: prediction });
    });

    //   app.post(`/quotes/post`, async (req, res) => {
    //     try {
    //       const quotePosted = new Quote({
    //         quote: req.body.quote,
    //         author: req.body.author,
    //       });
    //       await quotePosted.save();
    //       console.log("posting a new quote:", quotePosted);
    //       return res.send(quotePosted);
    //     } catch (error) {
    //       console.log("hey there's an err", error);
    //       return res.send(error);
    //     }
    //   });
};