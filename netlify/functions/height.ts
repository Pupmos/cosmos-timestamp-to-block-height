import fetch from "cross-fetch";

// other dates?
const loadBlockHeightFromTimestamp = async (chain: string, dateStr: string) => {
    const {
        chain: {
            params: {
                actual_block_time: secondPerBlock
            },
            apis: {
                rpc: rpcNodes
            }
        }
    } = await fetch(`https://chains.cosmos.directory/${chain}`).then(r => r.json());
    // most notional nodes are archive nodes, enabling us to go further back in history.
    // thank you Notional ❤
    const rpcUri = rpcNodes.find(n => n.provider?.toLowerCase().includes('notional')) || `https://rpc.cosmos.directory/${chain}`;
    console.log({ rpcUri });
    const {
        result: {
            block: {
                header: { height: currHeight, time: currTime },
            },
        },
    } = await fetch(`${rpcUri}/block`).then((r) => r.json());

    const date = new Date(dateStr);
    const ms = date.getTime();
    let sampleHeight = currHeight;
    let sampleTime = currTime;
    let estimatedBlockHeight = sampleHeight;
    while (true) {
        const delta = new Date(sampleTime).getTime() - ms;
        if (Math.abs(delta) < secondPerBlock * 1000) {
            break;
        }
        const estimatedBlockDelta = Math.floor(delta / (secondPerBlock * 1000));
        estimatedBlockHeight = sampleHeight - estimatedBlockDelta;
        const actualBlockTime = await fetch(
            `${rpcUri}/block?height=${estimatedBlockHeight}`
        )
            .then((r) => r.json())
            .then((r) => r.result.block.header.time);
        console.table({ actualBlockTime, dateStr });
        sampleTime = actualBlockTime;
        sampleHeight = estimatedBlockHeight;
    }
    return {
        exactHeight: sampleHeight,
        exactTime: sampleTime
    };
};


export const handler = async (event) => {
    let { chain, timestamp } = JSON.parse(event.body);
   
    let { exactHeight, exactTime } = await loadBlockHeightFromTimestamp(chain, timestamp)

    // Netlify Functions need to return an object with a statusCode
    // Other properties such as headers or body can also be included.
    return {
        statusCode: 200,
        body: JSON.stringify({
            exactHeight,
            exactTime
        })
    }
}
