<template>
  <div class="fixed bottom-7 right-4 z-30">
    <div @click="handleSettingsClick" class="cursor-pointer">
      <div class="flex flex-col justify-center items-center w-[62px] h-[62px] relative overflow-hidden rounded-[119.23px] bg-white"
        style="box-shadow: 0px 4.769230842590332px 15.380768775939941px 0 rgba(0,0,0,0.1);">
        <div :class="{ 'settings-button':!showSettings}">
          <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="flex-grow-0 flex-shrink-0 w-[33.38px] h-[33.38px] relative"
            preserveAspectRatio="none">
            <path v-if="!showSettings"
              d="M30.9104 16.9997H28.1283V7.26252H5.8719V25.8815L8.32402 23.9548H17.0001V26.7369H9.28624L3.08984 31.6055V5.87149C3.08984 5.10326 3.71263 4.48047 4.48087 4.48047H29.5193C30.2876 4.48047 30.9104 5.10326 30.9104 5.87149V16.9997ZM19.9839 26.8356C19.8524 26.3614 19.7822 25.8619 19.7822 25.3459C19.7822 24.8298 19.8524 24.3303 19.9839 23.8561L18.6275 23.0729L20.0185 20.6637L21.3761 21.4475C22.0739 20.737 22.9608 20.213 23.9552 19.957V18.3907H26.7373V19.957C27.7317 20.213 28.6186 20.737 29.3164 21.4475L30.674 20.6637L32.065 23.0729L30.7087 23.8561C30.8401 24.3303 30.9104 24.8298 30.9104 25.3459C30.9104 25.8619 30.8401 26.3614 30.7087 26.8356L32.065 27.6188L30.674 30.028L29.3164 29.2442C28.6186 29.9547 27.7317 30.4787 26.7373 30.7347V32.301H23.9552V30.7347C22.9608 30.4787 22.0739 29.9547 21.3761 29.2442L20.0185 30.028L18.6275 27.6188L19.9839 26.8356ZM25.3463 28.1279C26.8828 28.1279 28.1283 26.8824 28.1283 25.3459C28.1283 23.8093 26.8828 22.5638 25.3463 22.5638C23.8097 22.5638 22.5642 23.8093 22.5642 25.3459C22.5642 26.8824 23.8097 28.1279 25.3463 28.1279Z"
              fill="#5743d0">
            </path>
            <path v-else
              d="M30.9104 16.9997H28.1283V7.26252H5.8719V25.8815L8.32402 23.9548H17.0001V26.7369H9.28624L3.08984 31.6055V5.87149C3.08984 5.10326 3.71263 4.48047 4.48087 4.48047H29.5193C30.2876 4.48047 30.9104 5.10326 30.9104 5.87149V16.9997ZM19.9839 26.8356C19.8524 26.3614 19.7822 25.8619 19.7822 25.3459C19.7822 24.8298 19.8524 24.3303 19.9839 23.8561L18.6275 23.0729L20.0185 20.6637L21.3761 21.4475C22.0739 20.737 22.9608 20.213 23.9552 19.957V18.3907H26.7373V19.957C27.7317 20.213 28.6186 20.737 29.3164 21.4475L30.674 20.6637L32.065 23.0729L30.7087 23.8561C30.8401 24.3303 30.9104 24.8298 30.9104 25.3459C30.9104 25.8619 30.8401 26.3614 30.7087 26.8356L32.065 27.6188L30.674 30.028L29.3164 29.2442C28.6186 29.9547 27.7317 30.4787 26.7373 30.7347V32.301H23.9552V30.7347C22.9608 30.4787 22.0739 29.9547 21.3761 29.2442L20.0185 30.028L18.6275 27.6188L19.9839 26.8356ZM25.3463 28.1279C26.8828 28.1279 28.1283 26.8824 28.1283 25.3459C28.1283 23.8093 26.8828 22.5638 25.3463 22.5638C23.8097 22.5638 22.5642 23.8093 22.5642 25.3459C22.5642 26.8824 23.8097 28.1279 25.3463 28.1279Z"
              fill="#727272">
            </path>
          </svg>
        </div>

      </div>
    </div>
  </div>

  <div v-if="showSettings">
    <div class="fixed bottom-[100px] w-[373px] h-[446px] flex z-40"
      :class="{ 'right-10':!isMobile, 'w-full right-0':isMobile }"
      v-if="isOpen"
      style="box-shadow: 0px 4px 12.899999618530273px 0 rgba(0,0,0,0.1);" @click.stop="handleCloseBookCategory"></div>
    <div class="fixed bottom-[100px] w-[373px] h-[446px] overflow-hidden rounded-2xl bg-white z-30 flex flex-col"
      :class="{ 'right-10':!isMobile, 'w-full right-0':isMobile }"
      style="box-shadow: 0px 4px 12.899999618530273px 0 rgba(0,0,0,0.1);" @click.stop>
      <div v-if="settingState==='sspliot'" class="flex flex-col justify-center items-start w-full gap-1 px-6 py-5 rounded-tl-[10px] rounded-tr-[10px] bg-[#5743d0]/10">
        <p class="self-stretch flex-grow-0 flex-shrink-0 w-[325px] text-xl font-bold text-left text-[#5743d0]">
          자동 문장 추천 사용법
        </p>
        <p class="self-stretch flex-grow-0 flex-shrink-0 w-[325px] text-sm text-left text-[#474747]">
          <span class="self-stretch flex-grow-0 flex-shrink-0 w-[325px] text-sm text-left text-[#474747]">
            현재 쓰고 있는 글에 회색 글씨가 보이면
          </span>
          <br/>
          <span class="self-stretch flex-grow-0 flex-shrink-0 w-[325px] text-sm text-left text-[#474747]">
            PC에서는 
          </span>
          <span class="self-stretch flex-grow-0 flex-shrink-0 w-[325px] text-sm font-bold text-left text-[#474747]">
            Tab
          </span>
          <span class="self-stretch flex-grow-0 flex-shrink-0 w-[325px] text-sm text-left text-[#474747]">
            , 모바일에서는 적용 버튼을 
          </span>
          <span class="self-stretch flex-grow-0 flex-shrink-0 w-[325px] text-sm font-bold text-left text-[#474747]">
            터치
          </span>
          <span class="self-stretch flex-grow-0 flex-shrink-0 w-[325px] text-sm text-left text-[#474747]">
            해보세요!
          </span>
        </p>
      </div>
      <div v-else class="flex flex-col justify-center items-start w-full gap-1 px-6 py-5 rounded-tl-[10px] rounded-tr-[10px] bg-[#5743d0]/10">
        <p class="self-stretch flex-grow-0 flex-shrink-0 w-[325px] text-xl font-bold text-left text-[#5743d0]">
          책 설정 안내
        </p>
        <p class="self-stretch flex-grow-0 flex-shrink-0 w-[325px] text-sm text-left text-[#474747]">
          책 설정 내용을 활용하여 보다 일관성 있고 목표에 부합하는 책을 집필하실 수 있도록 도와드립니다.
        </p>
      </div>

      <div class="flex flex-row justify-center items-center p-[10px]">
        <div class="flex justify-start items-center gap-1 rounded-[47px] bg-[#f7f8fb] border border-[#f2f2f2]">
          <div class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-4 py-2.5 rounded-[1000px] cursor-pointer "
            :class="{ 'bg-white border border-[#f2f2f2]': settingState === 'sspliot' }"
            @click="handleSettingSspliotState">
            <p class="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-[#1b1b1b]">
              자동 문장 추천
            </p>
          </div>
          <div class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 px-4 py-2.5 rounded-[1000px] cursor-pointer "
            :class="{ 'bg-white border border-[#f2f2f2]': settingState === 'book' }"
            @click="handleSettingsBook">
            <p class="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-[#474747]">
              책 맞춤 설정
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-col flex-grow">
        <div v-if="settingState ==='sspliot'" class="flex flex-col justify-start items-start w-full pt-2">
          <div class="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative px-4 py-4 ml-2 mr-2 rounded cursor-pointer hover:bg-gray-200"
            @click="handleToggleSspilot">
            <div class="flex justify-start items-center flex-grow-0 flex-shrink-0 w-48 relative gap-2">
              <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                  preserveAspectRatio="none"
              >
                <path
                    d="M17 13.3333C17 13.7459 16.8361 14.1416 16.5444 14.4333C16.2527 14.725 15.857 14.8889 15.4444 14.8889H6.11111L3 18V5.55556C3 5.143 3.16389 4.74733 3.45561 4.45561C3.74733 4.16389 4.143 4 4.55556 4H15.4444C15.857 4 16.2527 4.16389 16.5444 4.45561C16.8361 4.74733 17 5.143 17 5.55556V13.3333Z"
                    stroke="#B3B7BC"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path>
              </svg>
              <p class="flex-grow-0 flex-shrink-0 text-base font-medium text-center text-[#1b1b1b]">
                  자동 문장 추천</p>
            </div>
            <div class="flex justify-end items-center flex-grow-0 flex-shrink-0 w-[52px] h-8 relative px-1 py-0.5 rounded-[100px]"
              :class="{ 'bg-[#35C082]':sspilotOn, 'bg-[#d6d8dc]':!sspilotOn }">
              <div class="self-stretch flex-grow relative">
                <div class="flex justify-center items-center absolute top-[-10px] p-1"
                  :class="{ 'left-2':sspilotOn, 'right-2':!sspilotOn }">
                  <div class="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 gap-2 p-2 rounded-[100px]">
                    <div class="flex justify-center items-center flex-grow-0 flex-shrink-0 relative overflow-hidden p-[11px] rounded-3xl bg-white">
                      <div class="flex-grow-0 flex-shrink-0 w-0.5 h-0.5 rounded-[23px]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="sspilotOn" class="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative px-4 py-4 ml-2 mr-2">
            <div class="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2">
              <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                  preserveAspectRatio="none"
              >
                <path
                    d="M10.0002 16.9993C13.8662 16.9993 17.0003 13.8653 17.0003 9.99919C17.0003 6.1331 13.8662 2.99902 10.0002 2.99902C6.13408 2.99902 3 6.1331 3 9.99919C3 13.8653 6.13408 16.9993 10.0002 16.9993Z"
                    stroke="#B3B7BC"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path>
                <path
                    d="M10 5.7998V9.9999L12.8001 11.3999"
                    stroke="#B3B7BC"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path>
              </svg>
              <p class="flex-grow-0 flex-shrink-0 text-base font-medium text-center text-[#1b1b1b]">
                자동 문장 추천 시간
              </p>
            </div>
            <div class="slider-container w-[140px] mx-auto pt-4">
              <div class="absolute left-[190px] h-1 bg-gray-300 w-[140px]">
              </div>
              <div class="slider relative h-1">
                <div v-for="(mark, index) in marks"
                  :key="index"
                  class="absolute top-[-24px] w-[30px] text-gray-600 text-center text-[12px] transform -translate-x-1/4 cursor-pointer"
                  :style="{ left: `${mark.position}%` }"
                  @click="setSliderValue(mark.value)">
                  {{ mark.value }}초
                  <div class="absolute left-[12px] top-[20px] w-1 h-2 bg-gray-300"></div>
                </div>
                <div class="absolute top-[-6px] w-3 h-3 bg-[#5743d0] rounded-full cursor-pointer transition-all"
                  :style="{ left: `${sliderPosition}%` }"
                  @mousedown="startDrag"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="relative flex flex-col justify-start items-start pt-2">
            <div class="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 px-4 py-4 ml-2 mr-2 rounded cursor-pointer hover:bg-gray-200"
                @click="bookCategoryToggleDropdown">
              <div class="flex justify-start items-center flex-grow-0 flex-shrink-0 w-28 relative gap-2">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                    preserveAspectRatio="none"
                >
                  <path
                      d="M3 3.7002H7.20001C7.94262 3.7002 8.65481 3.99519 9.17991 4.5203C9.70501 5.0454 10 5.75759 10 6.5002V16.3002C10 15.7433 9.77876 15.2091 9.38494 14.8153C8.99111 14.4215 8.45696 14.2002 7.90001 14.2002H3V3.7002Z"
                      stroke="#B3B7BC"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                  ></path>
                  <path
                      d="M17 3.7002H12.8C12.0574 3.7002 11.3452 3.99519 10.8201 4.5203C10.295 5.0454 10 5.75759 10 6.5002V16.3002C10 15.7433 10.2212 15.2091 10.6151 14.8153C11.0089 14.4215 11.543 14.2002 12.1 14.2002H17V3.7002Z"
                      stroke="#B3B7BC"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                  ></path>
                </svg>
                <p class="flex-grow-0 flex-shrink-0 text-base font-medium text-center text-[#1b1b1b]">
                  책 분야
                </p>
              </div>
              <div class="flex justify-end items-center flex-grow-0 flex-shrink-0 w-[167px] h-8 relative gap-1 cursor-pointer">
                <p class="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-[#474747]">{{ selectedCategory }}</p>
                <svg v-if="isOpen"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                    preserveAspectRatio="none"
                >
                  <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#727272"
                      stroke-width="1.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                  ></path>
                </svg>
                <svg v-else
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                    preserveAspectRatio="none">
                  <path
                      d="M7.5 15L12.5 10L7.5 5"
                      stroke="#727272"
                      stroke-width="1.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative px-4 py-4 ml-2 mr-2 rounded cursor-pointer hover:bg-gray-200"
                @click="openBookSettingModal">
              <div class="flex justify-start items-center flex-grow-0 flex-shrink-0 w-[201px] h-[30px] relative gap-2">
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                    preserveAspectRatio="none">
                  <path
                      d="M9.99967 12.8568C11.5776 12.8568 12.8568 11.5776 12.8568 9.99967C12.8568 8.42174 11.5776 7.14258 9.99967 7.14258C8.42174 7.14258 7.14258 8.42174 7.14258 9.99967C7.14258 11.5776 8.42174 12.8568 9.99967 12.8568Z"
                      stroke="#B3B7BC"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                  ></path>
                  <path
                      d="M15.3823 12.1814C15.2854 12.4008 15.2566 12.6441 15.2993 12.88C15.3421 13.1159 15.4546 13.3336 15.6222 13.505L15.6659 13.5486C15.8011 13.6837 15.9084 13.8441 15.9816 14.0207C16.0548 14.1973 16.0925 14.3865 16.0925 14.5777C16.0925 14.7688 16.0548 14.9581 15.9816 15.1347C15.9084 15.3112 15.8011 15.4716 15.6659 15.6067C15.5308 15.742 15.3704 15.8492 15.1938 15.9224C15.0172 15.9956 14.828 16.0333 14.6368 16.0333C14.4457 16.0333 14.2564 15.9956 14.0798 15.9224C13.9033 15.8492 13.7429 15.742 13.6078 15.6067L13.5641 15.5631C13.3927 15.3954 13.1751 15.283 12.9391 15.2402C12.7032 15.1974 12.4599 15.2263 12.2406 15.3231C12.0255 15.4153 11.842 15.5684 11.7128 15.7635C11.5836 15.9586 11.5143 16.1872 11.5133 16.4212V16.5449C11.5133 16.9306 11.3601 17.3006 11.0873 17.5733C10.8145 17.8461 10.4446 17.9994 10.0588 17.9994C9.67308 17.9994 9.30312 17.8461 9.03035 17.5733C8.75759 17.3006 8.60434 16.9306 8.60434 16.5449V16.4794C8.59871 16.2387 8.5208 16.0052 8.38073 15.8094C8.24065 15.6136 8.0449 15.4644 7.81892 15.3813C7.59957 15.2845 7.35625 15.2556 7.12034 15.2984C6.88443 15.3411 6.66674 15.4536 6.49534 15.6213L6.4517 15.6649C6.31662 15.8001 6.15621 15.9074 5.97964 15.9806C5.80307 16.0538 5.6138 16.0915 5.42266 16.0915C5.23151 16.0915 5.04225 16.0538 4.86567 15.9806C4.6891 15.9074 4.52869 15.8001 4.39361 15.6649C4.25837 15.5298 4.15109 15.3694 4.0779 15.1928C4.0047 15.0163 3.96703 14.827 3.96703 14.6359C3.96703 14.4447 4.0047 14.2554 4.0779 14.0789C4.15109 13.9023 4.25837 13.7419 4.39361 13.6068L4.43724 13.5632C4.6049 13.3918 4.71736 13.1741 4.76014 12.9382C4.80292 12.7023 4.77404 12.4589 4.67723 12.2396C4.58504 12.0245 4.43197 11.841 4.23686 11.7118C4.04175 11.5826 3.81311 11.5133 3.57909 11.5123H3.45546C3.06971 11.5123 2.69975 11.3591 2.42699 11.0863C2.15422 10.8136 2.00098 10.4436 2.00098 10.0579C2.00098 9.6721 2.15422 9.30215 2.42699 9.02938C2.69975 8.75661 3.06971 8.60337 3.45546 8.60337H3.52091C3.76163 8.59774 3.99508 8.51982 4.19092 8.37975C4.38677 8.23968 4.53594 8.04393 4.61905 7.81795C4.71586 7.5986 4.74474 7.35528 4.70196 7.11936C4.65919 6.88345 4.54672 6.66576 4.37906 6.49436L4.33543 6.45073C4.20019 6.31565 4.09291 6.15523 4.01972 5.97866C3.94652 5.80209 3.90885 5.61282 3.90885 5.42168C3.90885 5.23054 3.94652 5.04127 4.01972 4.8647C4.09291 4.68813 4.20019 4.52771 4.33543 4.39263C4.47051 4.2574 4.63092 4.15012 4.80749 4.07692C4.98407 4.00372 5.17333 3.96605 5.36448 3.96605C5.55562 3.96605 5.74489 4.00372 5.92146 4.07692C6.09803 4.15012 6.25844 4.2574 6.39353 4.39263L6.43716 4.43626C6.60856 4.60392 6.82625 4.71639 7.06216 4.75916C7.29808 4.80194 7.54139 4.77306 7.76074 4.67625H7.81892C8.03402 4.58407 8.21746 4.431 8.34668 4.23588C8.47589 4.04077 8.54523 3.81213 8.54617 3.57812V3.45449C8.54617 3.06873 8.69941 2.69878 8.97217 2.42601C9.24494 2.15324 9.6149 2 10.0007 2C10.3864 2 10.7564 2.15324 11.0291 2.42601C11.3019 2.69878 11.4551 3.06873 11.4551 3.45449V3.51994C11.4561 3.75396 11.5254 3.98259 11.6546 4.1777C11.7838 4.37282 11.9673 4.52589 12.1824 4.61808C12.4017 4.71488 12.645 4.74376 12.881 4.70098C13.1169 4.65821 13.3346 4.54574 13.506 4.37809L13.5496 4.33445C13.6847 4.19922 13.8451 4.09194 14.0217 4.01874C14.1982 3.94554 14.3875 3.90787 14.5786 3.90787C14.7698 3.90787 14.9591 3.94554 15.1356 4.01874C15.3122 4.09194 15.4726 4.19922 15.6077 4.33445C15.7429 4.46953 15.8502 4.62995 15.9234 4.80652C15.9966 4.98309 16.0343 5.17236 16.0343 5.3635C16.0343 5.55464 15.9966 5.74391 15.9234 5.92048C15.8502 6.09705 15.7429 6.25747 15.6077 6.39255L15.5641 6.43618C15.3964 6.60758 15.2839 6.82527 15.2412 7.06118C15.1984 7.2971 15.2273 7.54042 15.3241 7.75977V7.81795C15.4163 8.03304 15.5693 8.21649 15.7644 8.3457C15.9596 8.47491 16.1882 8.54426 16.4222 8.54519H16.5458C16.9316 8.54519 17.3015 8.69843 17.5743 8.9712C17.8471 9.24397 18.0003 9.61392 18.0003 9.99968C18.0003 10.3854 17.8471 10.7554 17.5743 11.0282C17.3015 11.3009 16.9316 11.4542 16.5458 11.4542H16.4804C16.2464 11.4551 16.0177 11.5244 15.8226 11.6536C15.6275 11.7829 15.4744 11.9663 15.3823 12.1814Z"
                      stroke="#B3B7BC"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"></path>
                </svg>
                <p class="flex-grow-0 flex-shrink-0 text-base font-medium text-center text-[#1b1b1b]">
                  책 맞춤 설정
                </p>
              </div>
              <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="flex-grow-0 flex-shrink-0 w-5 h-5 relative"
                  preserveAspectRatio="none">
                <path
                    d="M7.5 15L12.5 10L7.5 5"
                    stroke="#727272"
                    stroke-width="1.66667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center mb-3">
        <div class="hover-button flex justify-center items-center w-[325px] h-[52px] gap-2.5 p-2.5 rounded-lg bg-[#5743d0] hover:bg-[#6146ff] cursor-pointer" 
          @click="handleSave()">
          <p class="flex-grow-0 flex-shrink-0 text-sm font-bold text-left text-white z-10">
            저장하기
          </p>
        </div>
      </div>
    </div>
    <div v-if="isOpen" class="fixed bottom-[20px] right-[50px] w-[196px] h-[280px] overflow-y-auto rounded-[10px] mt-2 bg-white border shadow-lg z-40">
      <div class="flex flex-col justify-center items-start w-[196px] overflow-y-auto px-1 py-1.5 rounded-[10px] bg-white" style="box-shadow: 0px 0px 12.100000381469727px 0 rgba(107,107,107,0.25);">
        <div
            v-for="(category, index) in categories"
            :key="index"
            class="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-[52px] relative gap-4 px-4 py-1 rounded-md hover:bg-[#f2f2f2] cursor-pointer"
            :class="[selectedCategory === category ?  'bg-[#f9f4ff]' : '']"
            @click="selectCategory(category)"
        >
          <p class="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-[#494949]">{{ category }}</p>
        </div>
      </div>
    </div>
    <BookSettingModal
        v-if="bookSettingModal"
        @close="handleCloseBookSettingModal"
    ></BookSettingModal>
    <div class="fixed top-0 left-0 w-full h-full flex z-20 bg-black bg-opacity-50" @click="handleSettingsClick"></div>
  </div>
</template>

<script>
import BookSettingModal from "@/components/Editor/Center/booksetting/BookSettingModal.vue";

export default {
    data() {
      return {
        settingState: 'sspliot',
        isOpen: false,
        selectedCategory: '',
        categories: ['에세이', '자기계발', '소설', '인문', '여행', '시'],
        bookSettingModal: false,
        marks: [
          { value: 3, position: 0 },
          { value: 5, position: 25 },
          { value: 10, position: 50 },
          { value: 15, position: 75 },
          { value: 20, position: 100 },
        ],
        sliderPosition: this.$store.getters.sspilotTime === 3 ? 0 : this.$store.getters.sspilotTime === 5 ? 25 : this.$store.getters.sspilotTime === 10 ? 50 : this.$store.getters.sspilotTime === 15 ? 75 : 100,
        isDragging: false,
      }
    },
    components: {
      BookSettingModal
    },
    mounted() {
      this.$store.dispatch('fetchCustomSetting');
      this.selectedCategory = this.$store.getters.bookCategory || '(미설정)'
      // window.addEventListener('click', this.handleCloseBookCategory);
    },
    watch: {
      selectedCategory(newValue) {
        this.$store.commit('SET_BOOK_CATEGORY',newValue)
      }
    },
    computed: {
        isMobile() {
          return window.innerWidth < 660
        },
        sspilotOn() {
          return this.$store.getters.sspilotOn
        },
        sspilotTime() {
          return this.$store.getters.sspilotTime
        },
        showSettings() {
          return this.$store.getters.showSettings
        }
      },
      methods: {
        handleSettingsClick() {
          this.$store.dispatch('fetchCustomSetting');
          this.handleCloseBookSettingModal()
          this.isOpen = false;
          this.$store.commit('SET_SHOW_SETTINGS', !this.showSettings)
        },
        handleToggleSspilot() {
          this.$store.commit('TOGGLE_SSPILOT_STATE')
        },
        handleSave() {
          this.$store.commit('SET_SHOW_SETTINGS', false)
          this.$store.dispatch('updateBookSetting');
          window.location.reload()
        },
        handleSettingSspliotState(){
          this.settingState = 'sspliot'
        },
        handleSettingsBook(){
          this.settingState = 'book'
        },
        bookCategoryToggleDropdown() {
          this.isOpen = !this.isOpen;
        },
        selectCategory(category) {
          this.$store.commit('SET_BOOK_CATEGORY', category)
          this.selectedCategory = category;
          this.isOpen = false;
        },
        openBookSettingModal() {
          this.bookSettingModal = !this.bookSettingModal
        },
        handleCloseBookSettingModal() {
          this.bookSettingModal = false
        },
        handleCloseBookCategory() {
          if(this.isOpen){
            this.isOpen = false
          }
        },
        setSliderValue(value) {
          const mark = this.marks.find((m) => m.value === value);
          if (mark) {
            this.sliderPosition = mark.position;
          }
          this.$store.commit('SET_SSPILOT_TIME', value)
        },
        startDrag() {
          this.isDragging = true;
          document.addEventListener("mousemove", this.onDrag);
          document.addEventListener("mouseup", this.stopDrag);
        },
        onDrag(event) {
          if (!this.isDragging) return;
          
          const sliderRect = document.querySelector(".slider").getBoundingClientRect();
          const newLeft = Math.min(
            Math.max(0, event.clientX - sliderRect.left),
            sliderRect.width
          );
          const newPercentage = (newLeft / sliderRect.width) * 100;

          const closestMark = this.marks.reduce((prev, curr) =>
            Math.abs(curr.position - newPercentage) < Math.abs(prev.position - newPercentage) ? curr : prev
          );
          this.$store.commit('SET_SSPILOT_TIME', closestMark.value)
          this.sliderPosition = closestMark.position;
        },
        stopDrag() {
          this.isDragging = false;
          document.removeEventListener("mousemove", this.onDrag);
          document.removeEventListener("mouseup", this.stopDrag);
        },
      }
    }
</script>

<style scoped>
.settings-button {
  display: flex;
  justify-content: center; 
  align-items: center; 
  width: 62px; 
  height: 62px;
  background: linear-gradient(180deg, rgba(67, 67, 208, 0.7) 0%, rgba(144, 10, 250, 0.7) 100%);

}

.settings-button::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  right: 3px;
  bottom: 3px;
  background-color: white;
  border-radius: 192px; /* Match with the border-radius of the outer button */
  z-index: 1;
}

.settings-button > svg {
  position: relative;
  z-index: 2;
}

.hover-button {
  background: linear-gradient(129.78deg, #4343d0 19.07%, #900afa 93.09%);
  position: relative;
}

.hover-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #6146ff; /* Adjust the color and transparency as needed */
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.hover-button:hover::before {
  opacity: 1;
}

.button-text {
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  color: white;
  border-radius: 12px;
}
</style>
