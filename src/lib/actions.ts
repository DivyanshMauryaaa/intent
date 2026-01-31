export interface Action {
    slug: string;
    description: string;
    parameters: {
        type: string;
        properties: Record<string, any>;
        required?: string[];
    };
}

const actions: Action[] = [
    // --- Google: Gmail ---
    {
        slug: 'gmail_send',
        description: 'Send an email to one or multiple recipients',
        parameters: {
            type: 'object',
            properties: {
                to: { type: 'array', items: { type: 'string', description: 'Email address' }, description: 'List of recipient email addresses' },
                subject: { type: 'string', description: 'Subject of the email' },
                body: { type: 'string', description: 'HTML or text body of the email' },
                cc: { type: 'array', items: { type: 'string' }, description: 'CC recipients' },
                bcc: { type: 'array', items: { type: 'string' }, description: 'BCC recipients' },
                attachments: { type: 'array', items: { type: 'string', description: 'URL/Link of the file to attach' } }
            },
            required: ['to', 'subject', 'body'],
        },
    },
    {
        slug: 'gmail_reply',
        description: 'Reply to an existing email thread',
        parameters: {
            type: 'object',
            properties: {
                threadId: { type: 'string', description: 'The ID of the thread to reply to' },
                body: { type: 'string', description: 'The content of the reply' },
                to: { type: 'array', items: { type: 'string' }, description: 'Recipients (defaults to sender)' },
                cc: { type: 'array', items: { type: 'string' } },
                attachments: { type: 'array', items: { type: 'string' } }
            },
            required: ['threadId', 'body']
        }
    },
    {
        slug: 'gmail_search',
        description: 'Search for emails using Gmail search query format',
        parameters: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'Gmail search query (e.g., "from:alice is:unread")' },
                maxResults: { type: 'number', description: 'Maximum number of results to return (default 10)' }
            },
            required: ['query']
        }
    },
    {
        slug: 'gmail_get_message',
        description: 'Get details of a specific email message',
        parameters: {
            type: 'object',
            properties: {
                messageId: { type: 'string', description: 'The ID of the message to retrieve' }
            },
            required: ['messageId']
        }
    },
    {
        slug: 'gmail_delete_message',
        description: 'Trash a specific email message',
        parameters: {
            type: 'object',
            properties: {
                messageId: { type: 'string', description: 'The ID of the message to trash' }
            },
            required: ['messageId']
        }
    },

    // --- Google: Calendar ---
    {
        slug: 'google_calendar_list_events',
        description: 'List upcoming events from the primary calendar',
        parameters: {
            type: 'object',
            properties: {
                timeMin: { type: 'string', description: 'ISO start time (default: now)' },
                timeMax: { type: 'string', description: 'ISO end time' },
                maxResults: { type: 'number', description: 'Max events to return (default 10)' }
            }
        }
    },
    {
        slug: 'google_calendar_create_event',
        description: 'Create a new event in the primary calendar',
        parameters: {
            type: 'object',
            properties: {
                summary: { type: 'string', description: 'Event title' },
                description: { type: 'string', description: 'Event description' },
                start: { type: 'string', description: 'Start time (ISO 8601)' },
                end: { type: 'string', description: 'End time (ISO 8601)' },
                attendees: { type: 'array', items: { type: 'string' }, description: 'List of attendee emails' },
                location: { type: 'string', description: 'Event location' }
            },
            required: ['summary', 'start', 'end']
        }
    },
    {
        slug: 'google_calendar_update_event',
        description: 'Update an existing calendar event',
        parameters: {
            type: 'object',
            properties: {
                eventId: { type: 'string', description: 'ID of the event to update' },
                summary: { type: 'string' },
                description: { type: 'string' },
                start: { type: 'string' },
                end: { type: 'string' },
                attendees: { type: 'array', items: { type: 'string' } }
            },
            required: ['eventId']
        }
    },
    {
        slug: 'google_calendar_delete_event',
        description: 'Delete a calendar event',
        parameters: {
            type: 'object',
            properties: {
                eventId: { type: 'string', description: 'ID of the event to delete' }
            },
            required: ['eventId']
        }
    },

    // --- Google: Meet ---
    {
        slug: 'google_meet_create_meeting',
        description: 'Create a Google, Meet meeting',
        parameters: {
            type: 'object',
            properties: {
                summary: { type: 'string', description: 'Meeting summary' },
                startTime: { type: 'string', description: 'Start time (ISO string)' },
                endTime: { type: 'string', description: 'End time (ISO string)' }
            },
            required: ['summary', 'startTime', 'endTime']
        }
    },

    // --- Google: Drive ---
    {
        slug: 'google_drive_search',
        description: 'Search for files in Google Drive',
        parameters: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'Search query (name, mimeType, etc.)' },
                pageSize: { type: 'number', description: 'Max results' }
            },
            required: ['query']
        }
    },
    {
        slug: 'google_drive_create_folder',
        description: 'Create a new folder in Google Drive',
        parameters: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Name of the folder' },
                parentId: { type: 'string', description: 'ID of the parent folder (optional)' }
            },
            required: ['name']
        }
    },
    {
        slug: 'google_drive_delete_file',
        description: 'Permanently delete or trash a file/folder',
        parameters: {
            type: 'object',
            properties: {
                fileId: { type: 'string', description: 'ID of the file or folder' }
            },
            required: ['fileId']
        }
    },

    // --- Google: Docs ---
    {
        slug: 'google_docs_create',
        description: 'Create a new Google Doc',
        parameters: {
            type: 'object',
            properties: {
                title: { type: 'string', description: 'Document title' }
            },
            required: ['title']
        }
    },
    {
        slug: 'google_docs_append_text',
        description: 'Append text to a Google Doc',
        parameters: {
            type: 'object',
            properties: {
                documentId: { type: 'string', description: 'The ID of the document' },
                text: { type: 'string', description: 'Text to append' }
            },
            required: ['documentId', 'text']
        }
    },
    {
        slug: 'google_docs_get_content',
        description: 'Get text content of a Google Doc',
        parameters: {
            type: 'object',
            properties: {
                documentId: { type: 'string', description: 'The ID of the document' }
            },
            required: ['documentId']
        }
    },

    // --- Google: Sheets ---
    {
        slug: 'google_sheets_create',
        description: 'Create a new Google Sheet',
        parameters: {
            type: 'object',
            properties: {
                title: { type: 'string', description: 'Spreadsheet title' }
            },
            required: ['title']
        }
    },
    {
        slug: 'google_sheets_get_values',
        description: 'Read values from a range in a spreadsheet',
        parameters: {
            type: 'object',
            properties: {
                spreadsheetId: { type: 'string', description: 'ID of the spreadsheet' },
                range: { type: 'string', description: 'A1 notation range (e.g., "Sheet1!A1:B10")' }
            },
            required: ['spreadsheetId', 'range']
        }
    },
    {
        slug: 'google_sheets_append_values',
        description: 'Append values to a spreadsheet',
        parameters: {
            type: 'object',
            properties: {
                spreadsheetId: { type: 'string', description: 'ID of the spreadsheet' },
                range: { type: 'string', description: 'Range to search for a table to append to' },
                values: {
                    type: 'array',
                    items: { type: 'array', items: { type: 'string' } },
                    description: '2D array of values to append'
                }
            },
            required: ['spreadsheetId', 'range', 'values']
        }
    },

    // --- Slack ---
    {
        slug: 'slack_send_message',
        description: 'Send a message to a Slack channel or user',
        parameters: {
            type: 'object',
            properties: {
                channelId: { type: 'string', description: 'Channel ID or User ID' },
                text: { type: 'string', description: 'Message text' }
            },
            required: ['channelId', 'text']
        }
    },
    {
        slug: 'slack_list_channels',
        description: 'List public channels in the workspace',
        parameters: {
            type: 'object',
            properties: {
                limit: { type: 'number', description: 'Max number of channels to return' }
            }
        }
    },
    {
        slug: 'slack_create_channel',
        description: 'Create a new public or private channel',
        parameters: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Name of the channel' },
                isPrivate: { type: 'boolean', description: 'Whether the channel is private' }
            },
            required: ['name']
        }
    },
    {
        slug: 'slack_get_channel_history',
        description: 'Fetch recent messages from a channel',
        parameters: {
            type: 'object',
            properties: {
                channelId: { type: 'string', description: 'Channel ID' },
                limit: { type: 'number', description: 'Number of messages to fetch' }
            },
            required: ['channelId']
        }
    },

    // --- GitHub ---
    {
        slug: 'github_list_repos',
        description: 'List repositories for the authenticated user or an organization',
        parameters: {
            type: 'object',
            properties: {
                owner: { type: 'string', description: 'Username or Organization name (optional, defaults to auth user)' }
            }
        }
    },
    {
        slug: 'github_create_issue',
        description: 'Create a new issue in a repository',
        parameters: {
            type: 'object',
            properties: {
                owner: { type: 'string', description: 'Repository owner' },
                repo: { type: 'string', description: 'Repository name' },
                title: { type: 'string', description: 'Issue title' },
                body: { type: 'string', description: 'Issue description/body' },
                labels: { type: 'array', items: { type: 'string' } },
                assignees: { type: 'array', items: { type: 'string' } }
            },
            required: ['owner', 'repo', 'title']
        }
    },
    {
        slug: 'github_list_issues',
        description: 'List issues in a repository',
        parameters: {
            type: 'object',
            properties: {
                owner: { type: 'string' },
                repo: { type: 'string' },
                state: { type: 'string', enum: ['open', 'closed', 'all'], description: 'Issue state' }
            },
            required: ['owner', 'repo']
        }
    },
    {
        slug: 'github_update_issue',
        description: 'Update an issue (e.g., close, reopen, edit)',
        parameters: {
            type: 'object',
            properties: {
                owner: { type: 'string' },
                repo: { type: 'string' },
                issueNumber: { type: 'number' },
                state: { type: 'string', enum: ['open', 'closed'] },
                title: { type: 'string' },
                body: { type: 'string' }
            },
            required: ['owner', 'repo', 'issueNumber']
        }
    },
    {
        slug: 'github_create_pull_request',
        description: 'Create a Pull Request',
        parameters: {
            type: 'object',
            properties: {
                owner: { type: 'string' },
                repo: { type: 'string' },
                title: { type: 'string' },
                body: { type: 'string' },
                head: { type: 'string', description: 'The name of the branch where your changes are implemented' },
                base: { type: 'string', description: 'The name of the branch you want the changes pulled into' }
            },
            required: ['owner', 'repo', 'title', 'head', 'base']
        }
    },

    // --- Notion ---
    {
        slug: 'notion_search',
        description: 'Search pages or databases in Notion',
        parameters: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'Search query' }
            },
            required: ['query']
        }
    },
    {
        slug: 'notion_create_page',
        description: 'Create a new page in Notion',
        parameters: {
            type: 'object',
            properties: {
                parentId: { type: 'string', description: 'ID of the parent page or database' },
                title: { type: 'string', description: 'Page title' },
                properties: {
                    type: 'object',
                    description: 'JSON object defining page properties (if database item)'
                }
            },
            required: ['parentId']
        }
    },
    {
        slug: 'notion_get_page',
        description: 'Retrieve a page content',
        parameters: {
            type: 'object',
            properties: {
                pageId: { type: 'string', description: 'ID of the page' }
            },
            required: ['pageId']
        }
    },
    {
        slug: 'notion_update_page',
        description: 'Update page properties or archive it',
        parameters: {
            type: 'object',
            properties: {
                pageId: { type: 'string', description: 'ID of the page' },
                properties: { type: 'object', description: 'Properties to update' },
                archived: { type: 'boolean', description: 'Set to true to archive (delete) the page' }
            },
            required: ['pageId']
        }
    },
    {
        slug: 'notion_append_block_children',
        description: 'Append content blocks to a page',
        parameters: {
            type: 'object',
            properties: {
                blockId: { type: 'string', description: 'ID of the block (or page) to append to' },
                children: {
                    type: 'array',
                    items: { type: 'object' },
                    description: 'Array of block objects (paragraph, heading, etc.)'
                }
            },
            required: ['blockId', 'children']
        }
    },

    // --- Atlassian: Jira ---
    {
        slug: 'jira_search_issues',
        description: 'Search Jira issues using JQL',
        parameters: {
            type: 'object',
            properties: {
                jql: { type: 'string', description: 'Jira Query Language string' },
                maxResults: { type: 'number' }
            },
            required: ['jql']
        }
    },
    {
        slug: 'jira_create_issue',
        description: 'Create a new Jira issue',
        parameters: {
            type: 'object',
            properties: {
                projectKey: { type: 'string', description: 'Project Key (e.g. PROJ)' },
                summary: { type: 'string', description: 'Issue summary/title' },
                description: { type: 'string', description: 'Issue description' },
                issueType: { type: 'string', description: 'Issue Type (e.g., Task, Bug, Story)' }
            },
            required: ['projectKey', 'summary', 'issueType']
        }
    },
    {
        slug: 'jira_get_issue',
        description: 'Get details of a Jira issue',
        parameters: {
            type: 'object',
            properties: {
                issueIdOrKey: { type: 'string', description: 'Issue Key (PROJ-123) or ID' }
            },
            required: ['issueIdOrKey']
        }
    },
    {
        slug: 'jira_add_comment',
        description: 'Add a comment to an issue',
        parameters: {
            type: 'object',
            properties: {
                issueIdOrKey: { type: 'string' },
                comment: { type: 'string' }
            },
            required: ['issueIdOrKey', 'comment']
        }
    },

    {
        slug: 'jira_delete_issue',
        description: 'Delete a Jira issue',
        parameters: {
            type: 'object',
            properties: {
                issueIdOrKey: { type: 'string' }
            },
            required: ['issueIdOrKey']
        }
    },

    {
        slug: 'ai_generate',
        description: 'Generate content using AI',
        parameters: {
            type: 'object',
            properties: {
                prompt: { type: 'string', description: 'Prompt for AI generation' },
                // outputType: { type: 'string', description: 'Output type (e.g., text, image, code)' },
            },
            required: ['prompt']
        }
    },

    // --- Atlassian: Trello ---
    {
        slug: 'trello_create_board',
        description: 'Create a new Trello board',
        parameters: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Board name' }
            },
            required: ['name']
        }
    },
    {
        slug: 'trello_list_cards',
        description: 'List cards in a list',
        parameters: {
            type: 'object',
            properties: {
                listId: { type: 'string', description: 'ID of the list' }
            },
            required: ['listId']
        }
    },
    {
        slug: 'trello_create_card',
        description: 'Create a new Trello card',
        parameters: {
            type: 'object',
            properties: {
                idList: { type: 'string', description: 'ID of the list to add card to' },
                name: { type: 'string', description: 'Card title' },
                desc: { type: 'string', description: 'Card description' }
            },
            required: ['idList', 'name']
        }
    },

    // --- Atlassian: Confluence ---
    {
        slug: 'confluence_create_page',
        description: 'Create a new page in Confluence',
        parameters: {
            type: 'object',
            properties: {
                spaceKey: { type: 'string', description: 'Space key' },
                title: { type: 'string', description: 'Page title' },
                body: { type: 'string', description: 'Storage format body (HTML)' }
            },
            required: ['spaceKey', 'title', 'body']
        }
    },

    // --- Microsoft ---
    {
        slug: 'outlook_send_email',
        description: 'Send an email via Outlook',
        parameters: {
            type: 'object',
            properties: {
                to: { type: 'array', items: { type: 'string' } },
                subject: { type: 'string' },
                body: { type: 'string' }
            },
            required: ['to', 'subject', 'body']
        }
    },
    {
        slug: 'teams_send_message',
        description: 'Send a message to a Teams channel',
        parameters: {
            type: 'object',
            properties: {
                chatId: { type: 'string', description: 'Chat/Channel ID' },
                content: { type: 'string', description: 'Message content' }
            },
            required: ['chatId', 'content']
        }
    },

    // --- Meta ---
    // (Placeholders as valid Meta integrations usually require specific setup per app type)
    {
        slug: 'facebook_post_feed',
        description: 'Post to Facebook Feed',
        parameters: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                link: { type: 'string' }
            },
            required: ['message']
        }
    },
    {
        slug: 'whatsapp_send_message',
        description: 'Send a WhatsApp message',
        parameters: {
            type: 'object',
            properties: {
                to: { type: 'string', description: 'Phone number' },
                message: { type: 'string', description: 'Message text' }
            },
            required: ['to', 'message']
        }
    },
    {
        slug: 'instagram_post_media',
        description: 'Post a photo to Instagram',
        parameters: {
            type: 'object',
            properties: {
                imageUrl: { type: 'string', description: 'URL of the image' },
                caption: { type: 'string', description: 'Caption for the post' }
            },
            required: ['imageUrl']
        }
    },
    {
        slug: 'run_workflow',
        description: 'Run a workflow',
        parameters: {
            type: 'object',
            properties: {
                nodes: {
                    type: 'array',
                    description: 'List of nodes in the workflow',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            type: { type: 'string', description: 'Node type (default: "actionNode")' },
                            position: {
                                type: 'object',
                                properties: {
                                    x: { type: 'number' },
                                    y: { type: 'number' }
                                }
                            },
                            data: {
                                type: 'object',
                                properties: {
                                    slug: { type: 'string', description: 'Action slug (e.g. gmail_send)' },
                                    title: { type: 'string' },
                                    description: { type: 'string' },
                                    status: { type: 'string', enum: ['idle', 'running', 'success', 'error'] },
                                    // Allow other properties for action params
                                },
                                required: ['slug', 'title']
                            }
                        },
                        required: ['id', 'data', 'position']
                    }
                },
                edges: {
                    type: 'array',
                    description: 'List of connections between nodes',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            source: { type: 'string' },
                            target: { type: 'string' }
                        },
                        required: ['id', 'source', 'target']
                    }
                }
            },
            required: ['nodes', 'edges']
        }
    },
    {
        slug: 'post_x',
        description: 'Post a tweet to X',
        parameters: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                link: { type: 'string' }
            },
            required: ['message']
        }
    },

    // --- LinkedIn ---
    {
        slug: 'linkedin_post_feed',
        description: 'Post a text or article to LinkedIn feed',
        parameters: {
            type: 'object',
            properties: {
                text: { type: 'string', description: 'Post content' },
                articleUrl: { type: 'string', description: 'URL to share (optional)' },
                visibility: { type: 'string', enum: ['PUBLIC', 'CONNECTIONS'], description: 'Post visibility' }
            },
            required: ['text']
        }
    },

    // --- YouTube ---
    {
        slug: 'youtube_upload_video',
        description: 'Upload a video to YouTube',
        parameters: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                videoUrl: { type: 'string', description: 'Storage URL of the video file' },
                privacyStatus: { type: 'string', enum: ['public', 'private', 'unlisted'] },
                tags: { type: 'array', items: { type: 'string' } }
            },
            required: ['title', 'videoUrl']
        }
    },
    {
        slug: 'youtube_get_channel_stats',
        description: 'Get statistics for a YouTube channel',
        parameters: {
            type: 'object',
            properties: {
                channelId: { type: 'string', description: 'Channel ID (optional, defaults to auth user)' }
            }
        }
    },

    // --- TikTok ---
    {
        slug: 'tiktok_post_video',
        description: 'Upload a video to TikTok',
        parameters: {
            type: 'object',
            properties: {
                videoUrl: { type: 'string', description: 'Video file URL' },
                caption: { type: 'string' },
                privacy: { type: 'string', enum: ['PUBLIC', 'FRIENDS', 'PRIVATE'] }
            },
            required: ['videoUrl']
        }
    },

    // --- HubSpot ---
    {
        slug: 'hubspot_create_contact',
        description: 'Create a new contact in HubSpot',
        parameters: {
            type: 'object',
            properties: {
                email: { type: 'string' },
                firstname: { type: 'string' },
                lastname: { type: 'string' },
                phone: { type: 'string' },
                company: { type: 'string' }
            },
            required: ['email']
        }
    },
    {
        slug: 'hubspot_create_deal',
        description: 'Create a new deal in HubSpot',
        parameters: {
            type: 'object',
            properties: {
                dealname: { type: 'string' },
                amount: { type: 'number' },
                pipeline: { type: 'string' },
                dealstage: { type: 'string' }
            },
            required: ['dealname']
        }
    },

    // --- Mailchimp ---
    {
        slug: 'mailchimp_add_subscriber',
        description: 'Add a new subscriber to a Mailchimp audience',
        parameters: {
            type: 'object',
            properties: {
                listId: { type: 'string', description: 'Audience/List ID' },
                email: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                status: { type: 'string', enum: ['subscribed', 'pending'] }
            },
            required: ['listId', 'email']
        }
    },
    {
        slug: 'mailchimp_send_campaign',
        description: 'Create and send a campaign',
        parameters: {
            type: 'object',
            properties: {
                listId: { type: 'string' },
                subject: { type: 'string' },
                fromName: { type: 'string' },
                replyTo: { type: 'string' },
                htmlContent: { type: 'string' }
            },
            required: ['listId', 'subject', 'htmlContent']
        }
    },

    // --- Salesforce ---
    {
        slug: 'salesforce_create_lead',
        description: 'Create a new Lead in Salesforce',
        parameters: {
            type: 'object',
            properties: {
                lastName: { type: 'string' },
                company: { type: 'string' },
                email: { type: 'string' },
                firstName: { type: 'string' }
            },
            required: ['lastName', 'company']
        }
    },

    // --- Shopify ---
    {
        slug: 'shopify_get_products',
        description: 'List products from Shopify store',
        parameters: {
            type: 'object',
            properties: {
                limit: { type: 'number' },
                ids: { type: 'string', description: 'Comma separated IDs' }
            }
        }
    },
    {
        slug: 'shopify_create_order',
        description: 'Create a new order in Shopify',
        parameters: {
            type: 'object',
            properties: {
                line_items: { type: 'array', items: { type: 'object' } },
                customer: { type: 'object' }
            },
            required: ['line_items']
        }
    },

    // --- Stripe ---
    {
        slug: 'stripe_create_invoice',
        description: 'Create an invoice in Stripe',
        parameters: {
            type: 'object',
            properties: {
                customerId: { type: 'string' },
                amount: { type: 'number' },
                currency: { type: 'string', description: 'usd, eur, etc.' },
                description: { type: 'string' }
            },
            required: ['customerId']
        }
    },

    // --- Discord ---
    {
        slug: 'discord_send_message',
        description: 'Send a message to a Discord channel',
        parameters: {
            type: 'object',
            properties: {
                channelId: { type: 'string' },
                content: { type: 'string' },
                embeds: { type: 'array', items: { type: 'object' } }
            },
            required: ['channelId', 'content']
        }
    },

    // --- Zoom ---
    {
        slug: 'zoom_create_meeting',
        description: 'Create a scheduled Zoom meeting',
        parameters: {
            type: 'object',
            properties: {
                topic: { type: 'string' },
                startTime: { type: 'string', description: 'ISO format' },
                duration: { type: 'number', description: 'Minutes' },
                agenda: { type: 'string' }
            },
            required: ['topic', 'startTime']
        }
    },

    // --- Medium ---
    {
        slug: 'medium_create_post',
        description: 'Create a post on Medium',
        parameters: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                contentFormat: { type: 'string', enum: ['html', 'markdown'] },
                content: { type: 'string' },
                tags: { type: 'array', items: { type: 'string' } },
                publishStatus: { type: 'string', enum: ['public', 'draft', 'unlisted'] }
            },
            required: ['title', 'content', 'contentFormat']
        }
    },

    // --- WordPress ---
    {
        slug: 'wordpress_create_post',
        description: 'Create a new post on WordPress site',
        parameters: {
            type: 'object',
            properties: {
                title: { type: 'string' },
                content: { type: 'string' },
                status: { type: 'string', enum: ['publish', 'future', 'draft', 'pending', 'private'] },
                categories: { type: 'array', items: { type: 'number' }, description: 'Category IDs' }
            },
            required: ['title', 'content']
        }
    },

    // --- Airtable ---
    {
        slug: 'airtable_create_record',
        description: 'Create a record in Airtable',
        parameters: {
            type: 'object',
            properties: {
                baseId: { type: 'string' },
                tableIdOrName: { type: 'string' },
                fields: { type: 'object', description: 'Key-value pairs of field data' }
            },
            required: ['baseId', 'tableIdOrName', 'fields']
        }
    },
    {
        slug: 'airtable_list_records',
        description: 'List records from Airtable',
        parameters: {
            type: 'object',
            properties: {
                baseId: { type: 'string' },
                tableIdOrName: { type: 'string' },
                maxRecords: { type: 'number' },
                view: { type: 'string' }
            },
            required: ['baseId', 'tableIdOrName']
        }
    }
];

export default actions;