import * as core from "@actions/core"
import * as github from "@actions/github"

async function run() {
    try {
        const context = github.context
        core.debug(context)
        const logUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${context.sha}/checks`

        const url = core.getInput("target_url", { required: false }) || logUrl
        const ref = core.getInput("ref", { required: false }) || context.ref
        const token = core.getInput("token", { required: true })

        const client = new github.getOctokit(token, {
            previews: ["flash", "ant-man"],
        })

        const deployment = await client.repos.createDeployment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            ref: ref,
            required_contexts: [],
            environment,
            transient_environment: true,
            auto_merge,
            description,
        })

        await client.repos.createDeploymentStatus({
            ...context.repo,
            deployment_id: deployment.data.id,
            state: initialStatus,
            log_url: logUrl,
            environment_url: url,
        })

        core.debug(context)
    } catch (error) {}
}

run()
