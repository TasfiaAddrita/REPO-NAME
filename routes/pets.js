// MODELS
const Pet = require('../models/pet');

const mailer = require("../utils/mailer");

// PET ROUTES
module.exports = (app) => {

  // INDEX PET => index.js

  // NEW PET
  app.get('/pets/new', (req, res) => {
    res.render('pets-new');
  });

  // CREATE PET
  app.post('/pets', (req, res) => {
    var pet = new Pet(req.body);

    pet.save()
      .then((pet) => {
        res.redirect(`/pets/${pet._id}`);
      })
      .catch((err) => {
        // Handle Errors
      }) ;
  });

  // SHOW PET
  app.get('/pets/:id', (req, res) => {
    Pet.findById(req.params.id).exec((err, pet) => {
      res.render('pets-show', { pet: pet });
    });
  });

  // EDIT PET
  app.get('/pets/:id/edit', (req, res) => {
    Pet.findById(req.params.id).exec((err, pet) => {
      res.render('pets-edit', { pet: pet });
    });
  });

  // UPDATE PET
  app.put('/pets/:id', (req, res) => {
    Pet.findByIdAndUpdate(req.params.id, req.body)
      .then((pet) => {
        res.redirect(`/pets/${pet._id}`)
      })
      .catch((err) => {
        // Handle Errors
      });
  });

  // DELETE PET
  app.delete('/pets/:id', (req, res) => {
    Pet.findByIdAndRemove(req.params.id).exec((err, pet) => {
      return res.redirect('/')
    });
  });

  // SEARCH PET
  app.get("/search", (req, res) => {

    const term = new RegExp(req.query.term, "i");

    const page = req.query.page || 1

    Pet.paginate(
      { 
        $or: [
          {"name": term},
          {"species": term}
        ]
      }, 
      { page: page } 
    ).then((results) => {
      res.render("pets-index", { pets: results.docs, pagesCount: results.pages, currentPage: page, term: req.query.term });
    });
  });

  app.post("/pets/:id/purchase", (req, res) => {
    // console.log(`purchase body: ${req}`);
    var stripe = require("stripe")(process.env.PRIVATE_STRIPE_API_KEY);

    // token is created using Checkout or Elements!
    // get the payment token ID submitted by the form
    const token = req.body.stripeToken; // using express

    // req.body.petId can become null through seeding,
    // this way we'll insure we use a non-null value
    let petId = req.body.petId || req.params.id;

    Pet.findById(petId).exec((err, pet) => {
      if (err) {
        console.log("Error: " + err);
        res.redirect(`/pets/${req.params.id}`);
      }
      const charge = stripe.charges
        .create({
          amount: pet.price * 100,
          currency: "usd",
          description: "Example charge",
          source: token,
        })
        .then(() => {
          res.redirect(`/pets/${req.params.id}`);
        });
    })
  });
}
