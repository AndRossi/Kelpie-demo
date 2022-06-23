<script>
  import './app.css'
  import R from 'ramda'

  import {getConveNecessary} from './conve_necessary.svelte'
  import {getConveSufficient} from './conve_sufficient.svelte'
  import {getTranseNecessary} from './transe_necessary.svelte'
  import {getTranseSufficient} from './transe_sufficient.svelte'
  import {getComplexNecessary} from './complex_necessary.svelte'
  import {getComplexSufficient} from './complex_sufficient.svelte'

  const concatAll = R.unapply(R.reduce(R.concat, []))

  let data = concatAll(
    getConveNecessary(),
    getConveSufficient(),
    getTranseNecessary(),
    getTranseSufficient(),
    getComplexNecessary(),
    getComplexSufficient(),
  )

  let model = 'ComplEx'
  let dataset = 'FB15k'
  let scenario = 'necessary'

  let predictions = data
  let selectedPrediction = JSON.parse(
    '{"prediction": {"head": {                        "entity": "Holly Marie Combs",                        "description": "American actress"                    },                    "relation": "has been friends with",                    "tail": {                        "entity": "Ben Affleck",                        "description": "American actor"                    }                },                "explanation": {                    "facts": [                        {                            "head": {                                "entity": "Ben Affleck",                                "description": "American actor"                            },                            "relation": "has been friends with",                            "tail": {                                "entity": "Holly Marie Combs",                                "description": "American actress"                            }                        }                    ],                    "old_rank": 1,                    "new_rank": 689,                    "old_score": 10.693,                    "new_score": 2.616,                    "note": "classica relazione inversa di FB15k"                }            }',
  )
  let currentPrediction = -1

  async function loadSelectedPrediction() {
    var explainButton = document.getElementById('explain-button')
    explainButton.disabled = true
    explainButton.classList.add('bg-zinc-300')
    explainButton.classList.remove('hover:bg-violet-400')
    var loaderAnimation = document.getElementById('loader-animation')
    loaderAnimation.style.display = 'inline-block'

    await sleep(1000)

    currentPrediction = selectedPrediction
    explainButton.disabled = false
    explainButton.classList.remove('bg-zinc-300')
    explainButton.classList.add('hover:bg-violet-400')

    loaderAnimation.style.display = 'none'
  }

  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  $: {
    predictions =
      R.find(
        R.allPass([
          R.propEq('model', model),
          R.propEq('dataset', dataset),
          R.propEq('scenario', scenario),
        ]),
        data,
      ) || {}
  }
</script>

<div class="min-h-full">
  <nav class="border-b border-gray-200 bg-white">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between">
        <div class="flex">
          <div class="hidden sm:-my-px sm:flex sm:space-x-8">
            <a
              href="#"
              class="inline-flex items-center border-b-2 border-violet-500 pt-1 text-sm font-medium text-gray-900"
              aria-current="page"
            >
              Kelpie Demo
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <div class="h-full bg-gray-200">
    <!-- PREDICTED LINKS -->
    <div class="mx-auto flex max-w-5xl flex-col items-center py-10">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold leading-tight text-gray-900">
          Predicted Links
        </h1>
      </div>
      <div class="w-full">
        <div
          class="mx-auto my-8 flex max-w-5xl flex-col gap-10 sm:px-6 lg:px-8"
        >
          <!-- SELECT -->
          <div class="flex flex-row items-end gap-4">
            <div class="flex w-full flex-col items-start gap-2">
              <label
                for="location"
                class="w-40 text-sm font-medium text-gray-700">Model</label
              >
              <select
                bind:value={model}
                id="model"
                name="model"
                class="shadow mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm"
              >
                <option selected>ComplEx</option>
                <option>ConvE</option>
                <option>TransE</option>
              </select>
            </div>
            <div class="flex w-full flex-col items-start gap-2">
              <label
                for="location"
                class="w-40 text-sm font-medium text-gray-700">Dataset</label
              >
              <select
                bind:value={dataset}
                id="dataset"
                name="dataset"
                class="shadow mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm"
              >
                <option>FB15k</option>
                <option>WN18</option>
                <option>FB15k-237</option>
                <option>WN18RR</option>
                <option>YAG03-10</option>
              </select>
            </div>
            <div class="flex w-full flex-col items-start gap-2">
              <label
                for="location"
                class="w-40 text-sm font-medium text-gray-700">Expl. Type</label
              >
              <select
                bind:value={scenario}
                id="scenario"
                name="scenario"
                class="shadow mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm"
              >
                <option value="necessary" selected>Necessary</option>
                <option value="sufficient">Sufficient</option>
              </select>
            </div>
          </div>
          <!-- TABLE -->
          <div class="flex flex-col max-h-72">
            <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div
                class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8"
              >
                <div
                  class="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg "
                >
                  <table
                    class="min-w-full table-fixed divide-y divide-gray-300"
                  >
                    <thead class="bg-gray-100">
                      <tr>
                        <th
                          scope="col"
                          class="relative w-12 px-6 sm:w-16 sm:px-8"
                        />
                        <th
                          scope="col"
                          class="min-w-[12rem] py-4 pr-3 text-left text-sm font-semibold text-gray-900"
                          >Head Entity</th
                        >
                        <th
                          scope="col"
                          class="px-3 py-4 text-left text-sm font-semibold text-gray-900"
                          >Relation</th
                        >
                        <th
                          scope="col"
                          class="px-3 py-4 text-left text-sm font-semibold text-gray-900"
                          >Tail Entity</th
                        >
                      </tr>
                    </thead>
                    <tbody
                      class="divide-y divide-gray-200 bg-white overflow-y-auto"
                    >
                      <!-- Selected: "bg-gray-50" -->
                      {#each predictions.explained_predictions || [] as p}
                        <tr>
                          <td class="relative w-12 px-6 sm:w-16 sm:px-8">
                            <input
                              bind:group={selectedPrediction}
                              value={p}
                              name="link-explanation"
                              type="radio"
                              class="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 focus:ring-violet-500 sm:left-6"
                              style="accent-color: #7c3aed;"
                            />
                          </td>
                          <!-- Selected: "text-violet-600", Not Selected: "text-gray-900" -->
                          <td
                            class="max-w-xs truncate whitespace-nowrap py-4 pr-3 text-sm text-gray-900"
                            >{R.path(['prediction', 'head', 'entity'], p)}</td
                          >
                          <td
                            class="max-w-xs truncate whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                            >{R.path(['prediction', 'relation'], p)}</td
                          >
                          <td
                            class="max-w-xs truncate whitespace-nowrap px-3 py-4 text-sm text-gray-900"
                            >{R.path(['prediction', 'tail', 'entity'], p)}</td
                          >
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- BUTTON -->
          <div style="align-self: end;">
            <div id="loader-animation" class="lds-dual-ring" />

            <button
              id="explain-button"
              class="bg-violet-600 hover:bg-violet-800 text-white font-semibold pt-2 pb-3 px-5 inline-flex items-center md:rounded-lg shadow ring-1 ring-black ring-opacity-5"
              style="border:0px; padding-top:10px;"
              on:click={loadSelectedPrediction}
            >
              <svg
                class="fill-current w-5 h-5 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 779 801"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M451.5 37C463.5 21.3 478.4 2.09998 478.4 2.09998C478.4 2.09998 483.5 -6.5 487 14.5L489.4 28.5L543.3 93.3C553.036 105.009 561.626 115.063 568.944 123.63C583.877 141.107 593.517 152.39 596.8 158.9C601.693 168.601 602.621 170.82 603.7 180.9C604.588 189.193 601.047 196.072 596.8 201.507C593.185 206.132 587.176 208.636 580.883 209.932C574.303 211.287 561.342 210.364 556.4 208.5C548.135 205.382 545.285 203.056 539.023 197.946C536.639 196 533.76 193.65 529.9 190.7C515.9 180.1 502.8 170.8 500.8 170.1C493.3 167.6 484.2 172.9 482 180.9C481 184.6 481.6 188.6 483.9 192.8C484.5 193.9 504.2 209.5 527.7 227.5C551.3 245.5 572 261.7 573.8 263.4C580 269.1 589.3 282.4 593.7 291.7C600.5 306 603.2 317.6 603.7 335.7L604.2 350.9L608.9 351.8C611.4 352.4 633.8 356.3 658.5 360.6C683.3 364.8 703.8 368.6 704.1 368.9C704.5 369.2 709.4 404.4 715 447C722.5 504.1 725 525.8 724.5 529.5C723.1 540.4 716.5 549.4 706.5 554.2C699.1 557.7 696.2 557.8 695.6 554.7C694.8 551.2 692 528.6 692 526.3C692 524.4 692.8 524.1 698.5 523.5C702.9 523 705 522.3 705 521.4C705 520.4 673.2 433.8 672.6 433.4C672.6 433.336 661.121 434.841 643.946 437.092C634.394 438.344 623.08 439.827 611 441.4L556.4 433.4L478.4 554.7L338.838 395.911C338.838 395.911 370.276 353.069 381.225 338.106C399.122 313.646 398.944 303.998 398.871 300.048C398.867 299.82 398.863 299.61 398.863 299.418C398.863 295.905 390 283.7 390 283.7L375.5 292.5C367.5 297.4 360.7 301.1 360.5 300.8C360.2 300.5 357.4 281.2 354.4 257.9C351.3 234.6 348.6 215.3 348.4 215.1C348.2 214.9 341 215.7 332.3 216.8C323.6 217.9 316.4 218.8 316.3 218.6C316.1 218.5 323 201.2 331.4 180.2L346.9 142L332.9 131.3L319.7 119.9C319.7 119.9 337.1 112.1 357.5 103.5C359.364 102.71 361.198 101.933 362.993 101.173C380.744 93.6544 394.609 87.7816 394.7 87.6C394.8 87.5 393.9 79.5 392.6 69.9C391.3 60.3 390.3 52.4 390.4 52.3C390.4 52.3 399.2 55.3 409.9 59.1C420.5 62.9 429.4 65.9 429.5 65.8C429.565 65.6691 433.829 60.0981 440.131 51.8624C443.458 47.5147 447.354 42.4245 451.5 37ZM502.1 114.1C507.9 108.3 506.5 99.3 499.1 95.2C494.5 92.6 492.6 92.5 488.1 94.7C483.2 97.1 480.8 101.5 481.3 106.8C482.4 117.3 494.6 121.6 502.1 114.1Z"
                  fill="white"
                />
                <path
                  d="M613.2 215.5C594.4 235.5 577.374 251.89 577.374 252.39C577.374 252.619 586.189 259.924 594.007 270.3C595.448 272.213 603.03 281.791 607.489 294.246C611.948 306.701 613.035 315.271 613.035 315.271L655.993 275.585C655.993 275.585 670.524 248.2 671.724 248.5C672.724 248.8 693.3 257.2 713.4 267.5L750.1 286.1L746.8 290.3C745.1 292.6 743.3 295 742.9 295.6C742.1 296.6 769.6 318 771.8 318C772.4 318 774.1 315.4 775.7 312.2C778.2 307.1 778.5 305.4 778.5 296.5C778.5 287.7 778.2 285.9 775.8 281C774.3 278 771.2 273.6 768.8 271.3C763.5 266.2 649.9 179 648.5 179C647.9 179 632 195.4 613.2 215.5Z"
                  fill="white"
                />
                <path
                  d="M406.973 369.18L584.191 406.835C585.266 407.064 586.271 407.516 587.102 408.203C587.71 408.706 588.386 409.295 588.878 409.807C589.127 410.065 589.31 410.285 589.416 410.451C589.44 410.49 589.457 410.521 589.469 410.545C579.544 429.488 569.587 444.249 561.761 455.851L561.597 456.094C557.667 461.92 554.274 466.958 551.71 471.32C549.15 475.675 547.387 479.404 546.753 482.612C546.609 483.34 546.47 484.034 546.336 484.7C545.332 489.724 544.654 493.116 544.553 496.851C544.439 501.089 545.067 505.754 546.754 513.765C548.176 520.518 551.958 531.011 556.335 542.146C559.374 549.878 562.709 557.942 565.755 565.307C567.099 568.557 568.387 571.671 569.569 574.56C577.268 593.391 582.652 619.036 582.652 640.204C582.652 661.361 578.738 686.551 559.35 718.433C539.98 750.285 514.935 765.997 490.27 777.475C488.392 778.349 486.892 779.074 485.556 779.719C483.314 780.802 481.535 781.661 479.211 782.627C475.51 784.164 470.442 785.96 459.987 789.315C439.11 796.013 418.903 799.57 402.903 799.57C359.999 799.57 317.493 786.509 298.427 777.889C278.658 768.951 257.745 754.897 244.39 742.326C218.962 718.39 204.828 693.437 190.609 664.799C190.473 664.525 190.313 664.258 190.166 664.012C190.138 663.965 190.11 663.918 190.082 663.872C189.908 663.58 189.759 663.314 189.652 663.047C178.545 635.303 173.111 620.577 164.477 586.835C158.123 562.006 155.736 534.959 154.899 521.774C154.598 517.036 150.576 513.299 145.85 513.164C134.193 512.831 111.35 510.987 86.3407 502.5C68.2895 496.374 56.3942 490.299 47.1418 483.45C37.8888 476.601 31.2547 468.961 23.7355 459.659C15.7979 449.839 10.5598 436.136 7.11013 422.268C3.66273 408.409 2.01288 394.433 1.22401 384.104C0.752678 377.932 7.64631 374.448 12.5693 378.317L57.8213 413.888C58.9717 414.792 60.336 415.384 61.7823 415.606L113.271 423.524C113.631 423.58 113.986 423.661 114.334 423.768L154.571 436.133C158.142 437.231 162.011 435.868 164.106 432.775L175.24 416.337C175.77 415.554 176.443 414.879 177.224 414.346L208.339 393.127C210.214 391.848 211.5 389.872 211.91 387.64L219.101 348.482C220.402 341.393 229.587 340.234 232.408 346.788C236.331 355.905 240.697 366.874 244.081 377.579C247.468 388.295 249.858 398.703 249.858 406.715C249.858 420.375 249.62 433.672 247.326 445.515C245.033 457.352 240.694 467.691 232.525 475.467C220.229 487.172 204.242 496.476 196.911 500.448C194.312 501.855 192.522 504.463 192.459 507.46C192.238 517.883 193.065 544.861 205.358 572.573C213.195 590.239 220.135 602.484 228.097 612.822C236.059 623.161 245.028 631.574 256.898 641.586C272.556 654.794 291.94 667.14 313.003 673.007C333.966 678.846 353.752 682.254 370.187 673.972C377.643 670.214 382.736 667.085 386.547 663.571C390.37 660.047 392.881 656.156 395.213 650.911L395.301 650.713C396.676 647.62 397.861 644.955 398.404 641.341C398.957 637.652 398.839 633.006 397.639 625.902C397.032 622.305 394.596 615.164 391.211 606.327C387.819 597.469 383.452 586.855 378.956 576.282C369.966 555.141 360.447 534.134 357.145 527.633C350.6 514.74 345.121 499.9 347.499 468.606C348.057 461.257 351.001 452.202 355.2 442.633C359.395 433.073 364.825 423.039 370.323 413.741C381.319 395.146 392.569 379.528 394.706 376.594C394.945 376.266 395.188 375.992 395.486 375.703L400.19 371.135C401.983 369.393 404.527 368.66 406.973 369.18Z"
                  fill="white"
                  stroke="black"
                />
              </svg>
              <span>Explain</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- KELPIE EXPLANATION -->

    {#if currentPrediction != -1}
      <div class="mx-auto max-w-5xl px-4 pb-40 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold leading-tight text-gray-900">
          Kelpie Explanation
        </h1>
        <!-- EXPLAINED LINK -->
        <h1 class="mt-8 text-xl leading-tight text-gray-600">
          Prediction to explain
        </h1>
        <div class="mt-4 flex flex-row justify-center items-center gap-4">
          <div class="max-w-5xl w-full grow">
            <div
              class="flex flex-col justify-center h-32 grow rounded-lg border-2 border-violet-400 bg-white px-4 py-5 sm:px-6"
            >
              <h3 class="text-m font-medium leading-6 text-gray-900">
                {currentPrediction.prediction.head.entity}
              </h3>
              <p class="mt-1 text-sm text-gray-400">
                {currentPrediction.prediction.head.description}
              </p>
            </div>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#818CF8"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
          <div
            class="w-full flex h-32 flex-row grow items-center rounded-lg border-2 border-violet-400 bg-white px-4 sm:px-6"
          >
            <div class="w-full text-m">
              {currentPrediction.prediction.relation}
            </div>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#818CF8"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
          <div
            class="flex flex-col justify-center grow w-full h-32 rounded-lg border-2 border-violet-400 bg-white px-4 py-5 sm:px-6"
          >
            <h3 class="text-m font-medium leading-6 text-gray-900">
              {currentPrediction.prediction.tail.entity}
            </h3>
            <p class="mt-1 text-sm text-gray-400">
              {currentPrediction.prediction.tail.description}
            </p>
          </div>
        </div>

        <h1 class="mt-8 text-xl leading-tight text-gray-600">
          Extracted Explanation
        </h1>

        <div class="mt-4 flex flex-row gap-16">
          <!-- TABLE -->
          <div class="flex grow w-2/3 flex-col">
            <div class="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div
                class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8"
              >
                <div
                  class="shadow overflow-hidden ring-1 ring-black ring-opacity-5 md:rounded-lg"
                >
                  <table class="min-w-full divide-y divide-gray-300">
                    <thead class="bg-gray-100">
                      <tr>
                        <th
                          scope="col"
                          class="py-4 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >Head Entity</th
                        >
                        <th
                          scope="col"
                          class="px-3 py-4 text-left text-sm font-semibold text-gray-900"
                          >Relation</th
                        >
                        <th
                          scope="col"
                          class="px-3 py-4 text-left text-sm font-semibold text-gray-900"
                          >Tail Entity</th
                        >
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                      {#each currentPrediction.explanation.facts || [] as fact}
                        <tr>
                          <td
                            class="max-w-xs truncate py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                            >{fact.head.entity}</td
                          >
                          <td
                            class="max-w-xs truncate px-3 py-4 text-sm text-gray-500"
                            >{fact.relation}</td
                          >
                          <td
                            class="max-w-xs truncate px-3 py-4 text-sm text-gray-500"
                            >{fact.tail.entity}</td
                          >
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {#if scenario=="necessary"}

          <h1 class="mt-8 text-xl leading-tight text-gray-600">
            Statistics
          </h1>

          <div class="mt-4 flex flex-row grow-0 gap-8">
            <div class="flex flex-col gap-2">
              <p class="text-m" style="margin-left: 2rem;">Original Tail Rank: 
                <span class="font-bold">{currentPrediction.explanation.old_rank}</span>
              </p>
              <p class="text-m" style="margin-left: 2rem;">Tail Rank after removal: 
                <span class="font-bold text-purple-600">{currentPrediction.explanation.new_rank}</span>
              </p>
              <p class="text-m" style="margin-left: 2rem;">Original Score: 
                <span class="font-bold">{currentPrediction.explanation.old_score}</span>
              </p>
              {#if currentPrediction.explanation.old_score > currentPrediction.explanation.new_score}
              <p class="text-m" style="margin-left: 2rem;">Score after removal: 
                <span class="font-bold">{currentPrediction.explanation.new_score}</span> 
                  <span class="font-bold text-red-600">({(currentPrediction.explanation.new_score-currentPrediction.explanation.old_score).toFixed(3)})</span>
                </p>
              {:else}
                <p class="text-m" style="margin-left: 2rem;">Score after removal: 
                  <span class="font-bold">{currentPrediction.explanation.new_score}</span>
                  <span class="font-bold text-red-600"> +({(currentPrediction.explanation.new_score-currentPrediction.explanation.old_score).toFixed(3)})</span>
                </p>
              {/if}
            </div>
          </div>
        {/if}

        {#if scenario=="sufficient"}
          <h1 class="mt-8 text-xl leading-tight text-gray-600">
            Converted Entities
          </h1>

          <div class="mt-8 grid grid-cols-1 gap-8">
      
            {#each currentPrediction.explanation.converted || [] as converted_entity}
              <div class="max-w-m grid grid-cols-2">
                <div class="max-w-sm">
                  <div class="flex flex-col justify-center h-max-20 grow rounded-lg border-2 border-gray-400 bg-white px-4 py-5 sm:px-6">
                    <h3 class="text-sm font-medium leading-6 text-gray-900">
                      {converted_entity.entity.entity}
                    </h3>
                    <p class="mt-1 text-sm text-gray-400">
                      {converted_entity.entity.description}
                    </p>
                  </div>
                </div>
    
                <div class="mt-4 flex flex-row grow-0 gap-8" style="margin: 0; align-items: center;">
                  <div class="flex flex-col gap-2">
                    <p class="text-m">Original Tail Rank: 
                      <span class="font-bold">{converted_entity.original_rank}</span>
                    </p>
                    <p class="text-m">Conversion Tail Rank:
                      <span class="font-bold text-purple-600">{converted_entity.new_rank}</span>
                    </p>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
