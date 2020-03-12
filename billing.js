import stripePackage from 'stripe';
import { calculateCost } from './libs/billing-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context){
    const {storage, source} = JSON.parse(event.body); // source: Stripe token for the card that we are going to charge
    const amount = calculateCost(storage);
    const description = 'Scratch charge';

    // Load our secret key from the environment variable
    const stripe = stripePackage(process.env.stripeSecretKey);

    try{
        // const result = await stripe.charges.create({
        await stripe.charges.create({
            source,
            amount,
            description,
            currency: "cad"
        });
        // console.log('result',result);
        return success({status: true});
    }catch(e){
        // console.log('error',e);
        return failure({status: false});
    }
}