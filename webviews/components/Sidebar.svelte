<script lang="ts">
    import { onMount } from "svelte";
    let natLang = "";
    let shouldMatchOn = "";
    let regexOutput = "";
    let isCopied = false;
    let openAIKey = "";
    let loading = true;
    let apiKeyExists = false;
    let temp = false;


    onMount(() => {
        window.addEventListener("message", (event) => {
            const message = event.data;
            switch (message.type) {
                case "key":
                    console.log("RECIEVED KEY MESSAGE");
                    console.log("Key recieved: " + message.value);
                    openAIKey = message.value;
                    if(openAIKey !== "null"){
                        apiKeyExists = true;
                    }
                    loading = false;
                    break;
            }
        });
    });


    async function handleClick() {
        if(natLang === ""){
            return;
        }

        let prompt = "Turn natural language prompt into regex: " + natLang + ".";

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(openAIKey)
            },
            body: JSON.stringify({
                "model": "text-davinci-002",
                'prompt': prompt,
                'temperature': 0.7,
                'max_tokens': 256,
                'top_p': 1,
                'frequency_penalty': 0,
                'presence_penalty': 0,
            })
        };
        const response = await fetch('https://api.openai.com/v1/completions', requestOptions);
        const data = await response.json();
        console.log(data);
        regexOutput = data.choices[0].text
        isCopied = false;
	}

    const handleCopyOutput = () => {        
        navigator.clipboard.writeText(regexOutput);
        isCopied = true;
	}

    // const updateApiKey = () => {
    //     //go to settings
    //     // general.ApiKey
    //     openAIKey = getApiKey();
    //     console.log("KEY: " + openAIKey);
    //     if(openAIKey !== ""){
    //         apiKeyExists = true;
    //     }
    // }
    
</script>

<style>
    .font {
        font-size: 14px;
        font-weight: 500; 
    }

    .prompt-container{
        margin-top: 10px;
        margin-bottom: 20px;
    }
    .prompt-row{
        display: flex;
        flex-direction: row;
    }
    .prompt-text{
        margin-bottom: 5px;
        margin-right: 5px;
    }
    .prompt-asterick{
        color: #be1100;
    }

    .match-container{
        margin-bottom: 20px;
    }
    .match-text{
        margin-bottom: 5px;
    }

    .output-row{
        display: flex;
        flex-direction: row;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        margin-top: 40px;
        margin-bottom: 5px;
    }
    .output-copy{
        color: white;
        cursor: pointer;
        outline: 0;
    }
    .output-box{
        display: flex;
        background-color: #3c3c3c;
        justify-content: center;
        align-items: center;
    }
</style>

<div>
{#if loading}
    <div><strong>Loading...</strong></div>
{:else}
    <div>
        {#if apiKeyExists}
            <div>
                <div class="prompt-container">
                    <div class="prompt-row">
                        <div class="prompt-text font">Enter Prompt</div>
                        <div class="prompt-asterick font">*</div>
                    </div>
                    <textarea bind:value={natLang} rows="4"></textarea>
                </div>
                
                <div class="match-container">
                    <div class="match-text font">What it should match</div>
                    <textarea bind:value={shouldMatchOn}></textarea>
                </div>
                
                <button on:click={handleClick}>Go</button>
                
                <div class="output-row">
                    <div class="font">Output</div>
        
                    {#if regexOutput !== ""}
                        {#if !isCopied}
                            <!-- copy icon -->
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <span on:click={handleCopyOutput} class="output-copy"><svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 4l1-1h5.414L14 6.586V14l-1 1H5l-1-1V4zm9 3l-3-3H5v10h8V7z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M3 1L2 2v10l1 1V2h6.414l-1-1H3z"/></svg></span>
                        {:else}
                            <!-- check icon -->
                            <!-- svelte-ignore a11y-click-events-have-key-events -->
                            <span on:click={handleCopyOutput} class="output-copy"><svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M14.431 3.323l-8.47 10-.79-.036-3.35-4.77.818-.574 2.978 4.24 8.051-9.506.764.646z"/></svg></span>
                        {/if}
                    {/if}
                </div>
        
                {#if regexOutput !== ""}
                    <div class="output-box">
                        <div style="padding: 5px;">{regexOutput}</div>
                    </div>
                {/if}
            </div>
        {:else}
            <div style="margin-bottom: 10px;">
                <strong>No API key found in extension settings!</strong>
                Create an account at <a target="_blank" rel="noopener noreferrer" href="https://openai.com/api/">Openai</a> then copy and paste api key into extension settings.
            </div>
            <!-- <button on:click={updateApiKey}>I've added my API Key!</button> -->
            <button>Go to settings</button>
        {/if}
    </div>
{/if}
</div>