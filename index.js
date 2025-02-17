const express=require('express');
const app=express();

const movieRoutes=require('./routes/route');

app.use(express.json());
app.use('/api',movieRoutes);

app.listen(3000,()=>{`listening on port 3000`});

