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
]

export default integrations;