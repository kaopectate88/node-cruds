const Event = require('../models/event');

module.exports = {
  showEvents: showEvents,
  showSingle: showSingle,
  seedEvents: seedEvents,
  showCreate: showCreate,
  processCreate: processCreate,
  showEdit: showEdit,
  processEdit: processEdit,
  deleteEvent: deleteEvent
}

/**
 * Show all events
 */
function showEvents(req, res) {
  // get all events   
  Event.find({}, (err, events) => {
    if (err) {
      res.status(404);
      res.send('Events not found!');
    }

    // return a view with data
    res.render('pages/events', { 
      events: events,
      success: req.flash('success')
    });
  });
}

/**
 * Show a single event
 */
function showSingle(req, res) {
  // get a single event
  Event.findOne({ slug: req.params.slug }, (err, event) => {
    if (err) {
      res.status(404);
      res.send('Event not found!');
    }

    res.render('pages/single', { 
      event: event,
      success: req.flash('success')
    });
  });
}

/**
 * Seed the database
 */
function seedEvents(req, res) {
  // create some events
  const events = [
    { name: 'Basketball', description: 'Throwing into a basket.', email: 'abc@abc.com' },
    { name: 'Swimming', description: 'Michael Phelps is the fast fish.', email: 'abc@abc.com' },
    { name: 'Weightlifting', description: 'Lifting heavy things up', email: 'abc@abc.com' },
    { name: 'Ping Pong', description: 'Super fast paddles', email: 'abc@abc.com' }
  ];

  // use the Event model to insert/save
  Event.remove({}, () => {
    for (event of events) {
      var newEvent = new Event(event);
      newEvent.save();
    }
  });

  // seeded!
  res.send('Database seeded!');
}

/**
 * Show the create form
 */
function showCreate(req, res) {
  res.render('pages/create', {
    errors: req.flash('errors')
  });
}

/**
 * Process the creation form
 */
function processCreate(req, res) {
  // validate information
  req.checkBody('name', 'Name is required.').notEmpty();
  req.checkBody('description', 'Description is required.').notEmpty();
  req.checkBody('email', 'Email is required.').notEmpty();
  req.checkBody('date', 'Email is required.').notEmpty();
  req.checkBody('category', 'Category is required.').notEmpty();

  // if there are errors, redirect and save errors to flash
  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors.map(err => err.msg));
    return res.redirect('/events/create');
  }

  // create a new event
  const event = new Event({
    name: req.body.name,
    description: req.body.description,
    email: req.body.email,
    date: req.body.date,
    category: req.body.category

  });

  // save event
  event.save((err) => {
    if (err)
      throw err;

    // set a successful flash message
    req.flash('success', 'Successfuly created event!');

    // redirect to the newly created event
    res.redirect(`/events/${event.slug}`);
  });
}

/**
 * Show the edit form
 */
function showEdit(req, res) {
  Event.findOne({ slug: req.params.slug }, (err, event) => {
    res.render('pages/edit', {
      event: event,
      errors: req.flash('errors')
    });
  });
}

/**
 * Process the edit form
 */
function processEdit(req, res) {
  // validate information
  req.checkBody('name', 'Name is required.').notEmpty();
  req.checkBody('description', 'Description is required.').notEmpty();
  req.checkBody('email', 'Email is required.').notEmpty();
  req.checkBody('date', 'Email is required.').notEmpty();
  req.checkBody('category', 'Category is required.').notEmpty();

  // if there are errors, redirect and save errors to flash
  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors.map(err => err.msg));
    return res.redirect(`/events/${req.params.slug}/edit`);
  }

  // finding a current event
  Event.findOne({ slug: req.params.slug }, (err, event) => {
    // updating that event
    event.name        = req.body.name;
    event.description = req.body.description;
    event.email = req.body.email;
    event.date = req.body.date;
    event.category = req.body.category;

    event.save((err) => {
      if (err)
        throw err;

      // success flash message
      // redirect back to the /events
      req.flash('success', 'Successfully updated event.');
      res.redirect('/events');
    });
  });

}

/**
 * Delete an event
 */
function deleteEvent(req, res) {
  Event.remove({ slug: req.params.slug }, (err) => {
    // set flash data
    // redirect back to the events page
    req.flash('success', 'Event deleted!');
    res.redirect('/events');
  });
}