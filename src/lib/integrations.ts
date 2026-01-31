const integrations = [
    {
        name: "Google",
        description: "Help Intent Agent interact with google apps.",
        apps: ['Gmail', 'Sheets', 'Calendar', 'Drive', 'Docs', 'Meet'],
        logo: '/google.webp'
    },
    {
        name: "Meta",
        description: "Help Intent Agent interact with Meta apps.",
        apps: ['Facebook', 'Instagram', 'WhatsApp', 'Messenger'],
        logo: '/Meta.png'
    },
    {
        name: "Microsoft",
        description: "Help Intent Agent interact with Microsoft apps.",
        apps: ['Outlook', 'Teams', 'OneDrive', 'OneNote'],
        logo: '/microsoft.png'
    },
    {
        name: "Slack",
        description: "Help Intent Agent send messages to Slack.",
        apps: ['Slack'],
        logo: '/slack.png'
    },
    {
        name: "Notion",
        description: "Help Intent Agent interact with your Notion pages/workspace.",
        apps: ['Notion'],
        logo: '/notion.png'
    },
    {
        name: "Atlassian",
        description: "Help Intent Agent interact with your Atlassian apps.",
        apps: ['Jira', 'Trello', 'Confluence'],
        logo: '/Atlassian.png'
    },
    {
        name: "GitHub",
        description: "Help Intent Agent interact with your GitHub repos.",
        apps: ['GitHub'],
        logo: '/github.png'
    },
    {
        name: "X (Twitter)",
        description: "Post tweets and interact with your audience.",
        apps: ['X'],
        logo: '/x.png'
    },
    {
        name: "LinkedIn",
        description: "Share updates with your professional network.",
        apps: ['LinkedIn'],
        logo: '/linkedin.png'
    },
    {
        name: "YouTube",
        description: "Manage your channel and videos.",
        apps: ['YouTube', 'YouTube Studio'],
        logo: '/youtube.png'
    },
    {
        name: "TikTok",
        description: "Engage with your audience on TikTok.",
        apps: ['TikTok'],
        logo: '/tiktok.png'
    },
    {
        name: "HubSpot",
        description: "Manage your marketing, sales, and customer service.",
        apps: ['HubSpot'],
        logo: '/hubspot.png'
    },
    {
        name: "Salesforce",
        description: "Connect with customers and manage relationships.",
        apps: ['Salesforce'],
        logo: '/salesforce.png'
    },
    {
        name: "Mailchimp",
        description: "Send email campaigns and newsletters.",
        apps: ['Mailchimp'],
        logo: '/mailchimp.png'
    },
    {
        name: "Buffer",
        description: "Schedule posts for social media.",
        apps: ['Buffer'],
        logo: '/buffer.png'
    },
    {
        name: "Shopify",
        description: "Manage your online store and products.",
        apps: ['Shopify'],
        logo: '/shopify.png'
    },
    {
        name: "Stripe",
        description: "Process payments and manage subscriptions.",
        apps: ['Stripe'],
        logo: '/stripe.png'
    },
    {
        name: "WooCommerce",
        description: "Manage your WordPress e-commerce store.",
        apps: ['WooCommerce'],
        logo: '/woocommerce.png'
    },
    {
        name: "Discord",
        description: "Connect with your community via chat and voice.",
        apps: ['Discord'],
        logo: '/discord.png'
    },
    {
        name: "Zoom",
        description: "Schedule and manage video meetings.",
        apps: ['Zoom'],
        logo: '/zoom.png'
    },
    {
        name: "Medium",
        description: "Publish your stories and ideas.",
        apps: ['Medium'],
        logo: '/medium.png'
    },
    {
        name: "WordPress",
        description: "Manage your website content.",
        apps: ['WordPress'],
        logo: '/wordpress.png'
    },
    {
        name: "Substack",
        description: "Publish newsletters and grow your audience.",
        apps: ['Substack'],
        logo: '/substack.png'
    },
    {
        name: "Airtable",
        description: "Organize anything with flexible database.",
        apps: ['Airtable'],
        logo: '/airtable.png'
    },
    {
        name: "Dropbox",
        description: "Store and share files securely.",
        apps: ['Dropbox'],
        logo: '/dropbox.png'
    },
    {
        name: "Evernote",
        description: "Capture and organize your notes.",
        apps: ['Evernote'],
        logo: '/evernote.png'
    },
]

export default integrations;