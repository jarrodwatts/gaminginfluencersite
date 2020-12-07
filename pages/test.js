
function sum(a, b) {
    return a + b;
}

// TODO:

// --- Guest Tests --- \\
// As a guest...
// - View all offers
// - View an offer in detail
// - Try apply to an offer
// - Try to visit /profile
// - Try to sign in 
// - Try to sign up


// --- Brand Tests --- \\
// As a brand...
// - View all infleuncers
// - Filter by gender, platform, region
// - View an influencer in detail
// - Save an influencer
// - Create an offer (with bad and good data)
// - Visit my profile
// - Visit dashboard
// - Logout 
// - Edit my profile


// --- Influencer Tests --- \\
// As an influencer
// - View all offers
// - View an offer in detail
// - Apply to an offer
// - Logout
// - Visit my profile
// - Edit my profile


test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});