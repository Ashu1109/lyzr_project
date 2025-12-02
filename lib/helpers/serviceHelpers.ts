/**
 * Helper functions to interact with external services (Google Drive, Slack, GitHub)
 * These are example functions you can use in your AI agent
 */

/**
 * Fetch files from Google Drive
 */
export async function fetchGoogleDriveFiles(accessToken: string, query?: string) {
  try {
    const searchQuery = query ? `name contains '${query}'` : '';
    const url = `https://www.googleapis.com/drive/v3/files?${new URLSearchParams({
      q: searchQuery,
      fields: 'files(id, name, mimeType, modifiedTime, webViewLink)',
      pageSize: '10',
    })}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Google Drive API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error fetching Google Drive files:', error);
    throw error;
  }
}

/**
 * Search messages in Slack
 */
export async function searchSlackMessages(accessToken: string, query: string) {
  try {
    const url = `https://slack.com/api/search.messages?${new URLSearchParams({
      query,
      count: '10',
    })}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.ok) {
      throw new Error(`Slack API error: ${data.error}`);
    }

    return data.messages?.matches || [];
  } catch (error) {
    console.error('Error searching Slack messages:', error);
    throw error;
  }
}

/**
 * Get Slack channels
 */
export async function getSlackChannels(accessToken: string) {
  try {
    const response = await fetch('https://slack.com/api/conversations.list', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.ok) {
      throw new Error(`Slack API error: ${data.error}`);
    }

    return data.channels || [];
  } catch (error) {
    console.error('Error fetching Slack channels:', error);
    throw error;
  }
}

/**
 * Fetch GitHub repositories
 */
export async function fetchGithubRepos(accessToken: string, query?: string) {
  try {
    const url = query
      ? `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+user:@me&per_page=10`
      : 'https://api.github.com/user/repos?per_page=10&sort=updated';

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    return query ? data.items || [] : data;
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    throw error;
  }
}

/**
 * Search GitHub code
 */
export async function searchGithubCode(accessToken: string, query: string) {
  try {
    const url = `https://api.github.com/search/code?q=${encodeURIComponent(query)}+user:@me&per_page=10`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error searching GitHub code:', error);
    throw error;
  }
}

/**
 * Get GitHub issues
 */
export async function fetchGithubIssues(accessToken: string) {
  try {
    const response = await fetch('https://api.github.com/issues?per_page=10', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching GitHub issues:', error);
    throw error;
  }
}

/**
 * Refresh Google Drive access token using refresh token
 */
export async function refreshGoogleToken(refreshToken: string) {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh Google token');
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    };
  } catch (error) {
    console.error('Error refreshing Google token:', error);
    throw error;
  }
}
