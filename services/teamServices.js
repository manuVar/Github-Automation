const { Octokit } = require("@octokit/core");


const octokit = new Octokit({ auth: `` });

const getTeams = async (organization) => {
    try {
        const teamList = await octokit.request('GET /orgs/{org}/teams', {
            org: organization
        });
        return teamList.data;

    } catch (error) {
        console.log(`unexpected error occurred ${error}`)
    }
}


const getTeamByName = async (organization, teamName) => {
    const teamDetails = await octokit.request('GET /orgs/{org}/teams/{team_slug}', {
        org: organization,
        team_slug: teamName
    })
    return teamDetails;
}


const createTeams = async (organization, teamName, parentTeam) => {
    try {
        let params = {
            org: organization,
            name: teamName,
            privacy: 'closed'
        }
        if (parentTeam) {
            parentTeamDetails = await getTeamByName(organization, parentTeam);
            params.parent_team_id = parentTeamDetails.data.id;
        }
        // console.log(params);

        const createTeamResponse = await octokit.request('POST /orgs/{org}/teams', {
            ...params
        })

        console.log(createTeamResponse);

    } catch (error) {
        if (error.message == 'Not Found') {
            console.log(`Parent team name not found in organization ${organization}`)
        }
        else {
            console.log(`Error:  ${error}`);
        }
    }
}


const teamRepoAccess = async (org, teamName, owner, repo) => {
    try {
        const accessResp = await octokit.request('PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}', {
            org: org,
            team_slug: teamName,
            owner: owner,
            repo: repo,
            permission: 'admin'
        })
        console.log(accessResp);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getTeams,
    createTeams,
    getTeamByName,
    teamRepoAccess
}