/// <reference types="cypress" />

beforeEach('Open application', () => {
    cy.visit('/')
})

it('input fields', () => {
    cy.contains('Forms').click()
    cy.contains('Form Layouts').click()

    const name = 'JohnDoe'
    //using delay to type slowly
    cy.get('#inputEmail1').type('test@test.com', {delay: 200}).clear().type('test').clear()
    cy.contains('nb-card', 'Using the Grid').contains('Email').type(`${name}@test.com`)
    //sometimes the cypress types too fast and the value is not complete
    //using negative assertion to make sure the value is complete
    cy.get('#inputEmail1').should('not.have.value', '').clear().type('@test.com')
    .press(Cypress.Keyboard.Keys.TAB)//move to next field

    cy.contains('Auth').click()
    cy.contains('Login').click()

    cy.get('#input-email').type('test@test.com')
    cy.get('#input-password').type('test123{enter}')//look at documentation for keyboard events


})
    it('radio buttons', () => {
    cy.contains('Forms').click()
    cy.contains('Form Layouts').click()
    //select by label ,check is used for radio buttons and checkboxes
    //cypress look for the visible element so if the input is hidden it will not work
    //its looking for naiteve radio button but the ui is custom
    cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then( allRadioButtons => {
        cy.wrap(allRadioButtons).eq(0).check({force:true}).should('be.checked') //force true to force cypress to check hidden element
        cy.wrap(allRadioButtons).eq(1).check({force:true})
        cy.wrap(allRadioButtons).eq(0).should('not.be.checked')//verify first is not checked
        cy.wrap(allRadioButtons).eq(2).should('be.disabled')//verify third is disabled
    })
    //alternative way to select radio button by label, i can use .click and also but check is better for radio buttons
    cy.contains('nb-card', 'Using the Grid').contains('label', 'Option 1').find('input').check({force:true})

})

it('checkboxes', () => {
    cy.contains('Modal & Overlays').click()
    cy.contains('Toastr').click()
    //check the checkbox & uncheck for checkbox
    cy.get('[type="checkbox"]').check({force: true},{delay: 200})
    cy.get('[type="checkbox"]').should('be.checked')

})

it('lists and dropdowns', () => {
    cy.contains('Modal & Overlays').click()
    cy.contains('Toastr').click()
    //naiteve select dropdown will show select tag in html
    //div is the parent container of the select tag
    cy.contains('div', 'Toast type:').find('select').select('info').should('have.value', 'info')//it will select option with value info
    //acutal custome dropdown component nb-select
    //using the mouse to click on the dropdown to open it
    cy.contains('div', 'Position:').find('nb-select').click()//to expand the dropdown
    cy.get('.option-list').contains('bottom-right').click()//to select option
    //assertion to verify the selected option is correct
    cy.contains('div', 'Position:').find('nb-select').should('have.text', 'bottom-right')
    
    //loop through all dropdown options
    cy.contains('div', 'Position:').find('nb-select').then(dropdown => {
        cy.wrap(dropdown).click()
        //each is a jquery method that will loop through each option
        cy.get('.option-list nb-option').each((option, index, list) => {
            cy.wrap(option).click()//to keep the option
            if(index < list.length-1)//to collapse the dropdown except for the last option
                cy.wrap(dropdown).click()//to reopen the dropdown except for the last option
        })

    })
     
})

it('tooltips', () => {
    cy.contains('Modal & Overlays').click()
    cy.contains('Tooltip').click()
    //event listener to hover over the button
    cy.contains('button', 'Top').trigger('mouseenter')//cypress don't have hover method so we use trigger mouseenter
    cy.get('nb-tooltip').should('have.text', 'This is a tooltip')//the message is hidden in nb-tooltip 
})

//dialog is simiar to alert
it('dialog boxes', () => {
    //default confirm box
    cy.contains('Tables & Data').click()
    cy.contains('Smart Table').click()

    //1.using cy.on to handle window:confirm event
    cy.get('.nb-trash').first().click()
    cy.on('window:confirm', confirm => {
        expect(confirm).to.equal('Are you sure you want to delete?')
    })

    //2.if window confirm returns false the action is cancelled
    cy.window().then( win => { //cypress get access to window object
        cy.stub(win, 'confirm').as('dialogBox').returns(false)
        //looking for confirm method in window object and stubbing it
    })
    cy.get('.nb-trash').first().click()
    cy.get('@dialogBox').should('be.calledWith', 'Are you sure you want to delete?')
})


//web tables
it('web tables', () => {
    cy.contains('Tables & Data').click()
    cy.contains('Smart Table').click()

    //1. How to find by text
    cy.get('tbody').contains('tr', 'Larry').then( tableRow => {
        cy.wrap(tableRow).find('.nb-edit').click()
        cy.wrap(tableRow).find('[placeholder="Age"]').clear().type('35')
        cy.wrap(tableRow).find('.nb-checkmark').click()
        cy.wrap(tableRow).find('td').last().should('have.text', '35')//using last td is age column
    })  

    // //2. How to find by index
    cy.get('.nb-plus').click()
    cy.get('thead tr').eq(2).then(tableRow => {
        cy.wrap(tableRow).find('[placeholder="First Name"]').type('John')
        cy.wrap(tableRow).find('[placeholder="Last Name"]').type('Smith')
        cy.wrap(tableRow).find('[placeholder="Username"]').type('johnsmith')
        cy.wrap(tableRow).find('[placeholder="E-mail"]').type('johnsmith@test.com')
        cy.wrap(tableRow).find('[placeholder="Age"]').type('20')
        cy.wrap(tableRow).find('.nb-checkmark').click()
    })
    //verify the new row is added, reminder the index start at 0
    cy.get('tbody tr').first().find('td').then( tableColumns => {
        cy.wrap(tableColumns).eq(2).should('have.text', 'John')
        cy.wrap(tableColumns).eq(3).should('have.text', 'Smith')
        cy.wrap(tableColumns).eq(4).should('have.text', 'johnsmith')//default age is 20
        cy.wrap(tableColumns).eq(5).should('have.text', 'johnsmith@test.com')
        cy.wrap(tableColumns).eq(6).should('have.text', '20')
    })

    //3. Looping though the rows

    const ages = [20, 30, 40, 200]
   
    cy.wrap(ages).each(age => {
        cy.get('[placeholder="Age"]').clear().type(age)
        cy.wait(500) //wait for table to refresh, use wait as last resort
        cy.get('tbody tr').each(tableRows => {
            if (age == 200) {
                cy.wrap(tableRows).should('contain.text', 'No data found')
            } else {
                cy.wrap(tableRows).find('td').last().should('have.text', age)
            }
        })
    })
})

//date picker
it('datepickers', () => {
    cy.contains('Forms').click()
    cy.contains('Datepicker').click()

    //function to select date from current day
    function selectDateFromCurrentDay(day) {
        let date = new Date()
        date.setDate(date.getDate() + day)
        let futureDay = date.getDate()
        //get the month in long and short format
        let futureMonthLong = date.toLocaleDateString('en-US', { month: 'long' })
        let futureMonthShort = date.toLocaleDateString('en-US', { month: 'short' })
        let futureYear = date.getFullYear() //get full year in 4 digits
        let dateToAssert = `${futureMonthShort} ${futureDay}, ${futureYear}`
        //recursive function to select the date
        //get the current month and year displayed in the calendar
        cy.get('nb-calendar-view-mode').invoke('text').then(calendarMonthAndYear => {//get the current month and year displayed in the calendar

            if (!calendarMonthAndYear.includes(futureMonthLong) || !calendarMonthAndYear.includes(futureYear)) {
                cy.get('[data-name="chevron-right"]').click()
                selectDateFromCurrentDay(day)
            } else {
                cy.get('.day-cell').not('.bounding-month').contains(futureDay).click()
            }
        })
        return dateToAssert//return the date string to assert later
    }
    //select date from datepicker with input field
    cy.get('[placeholder="Form Picker"]').then(input => {
        cy.wrap(input).click()
        const dateToAssert = selectDateFromCurrentDay(10)
        cy.wrap(input).should('have.value', dateToAssert)
    })
})

//slider 
it('sliders', () => {

    cy.get('[tabtitle="Temperature"] circle')
        .invoke('attr', 'cx', '237.35')//attr is used to get or set attribute of an element/ cx is x coordinate
        .invoke('attr', 'cy', '54.92')//set cy attribute to move the slider
        .click()//click to apply the change
    cy.get('[class="value temperature h1"]').should('contain.text', '24')//verify the temperature value is updated
    
})

//drag and drop
it('drag and drop', () => {
    cy.contains('Extra Components').click()
    cy.contains('Drag & Drop').click()//setting up the test page for drag and drop

    //drag and drop using trigger method
    cy.get('#todo-list div').first().trigger('dragstart')//start dragging the first item
    cy.get('#drop-list').trigger('drop')//drop it in the drop list //from the page event listener

})

//iframe
it.only('iframes', () => {
    cy.contains('Modal & Overlays').click()
    cy.contains('Dialog').click()
    cy.frameLoaded('[data-cy="esc-close-iframe"]')
    //option number 1: directly access the iframe body
    cy.iframe('[data-cy="esc-close-iframe"]').contains('Open Dialog with esc close').click()
    cy.contains('Dismiss Dialog').click()

    //option number 2: use custom command to access iframe body
    cy.enter('[data-cy="esc-close-iframe"]').then( getBody => {
        getBody().contains('Open Dialog with esc close').click()
        cy.contains('Dismiss Dialog').click()
        getBody().contains('Open Dialog without esc close').click()
        cy.contains('OK').click()
    })


})