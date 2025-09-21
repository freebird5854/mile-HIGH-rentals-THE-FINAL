require('dotenv').config();
const express=require('express'), bodyParser=require('body-parser'), cors=require('cors');
const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY||'sk_test_4eC39HqLyjWDarjtT1zdp7dc');
const app=express(); app.use(cors()); app.use(bodyParser.json());
app.post('/create-checkout-session',async(req,res)=>{
  const { unit, amount } = req.body||{};
  try{
    const session=await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      line_items:[{price_data:{currency:'usd',product_data:{name:'Application fee — Unit '+(unit||'?')},unit_amount: amount||5000},quantity:1}],
      mode:'payment',
      success_url:(process.env.BASE_URL||'https://example.com')+'/payment-success',
      cancel_url:(process.env.BASE_URL||'https://example.com')+'/payment-cancelled'
    });
    res.json({url:session.url,sessionId:session.id});
  }catch(e){ res.status(500).json({error:e.message}); }
});
const PORT=process.env.PORT||4242;
app.listen(PORT,()=>console.log('Server running on',PORT));