<template lang="pug">
  div
    div.ma-0#score(ref="scorediv" style="height:220px; width:100%;")
    v-card
      //- v-row.justify-center
      //-   v-col(cols="6")
      //-     form#payment-form
      //-       #card-element(ref="card")
      v-row.justify-center
        v-col(cols="11")
          h1.display-1.text-left Description
        v-col(cols="11")
          p {{ description }}
        v-col
          v-btn(@click="changeBars") Change Bars

      v-row.justify-center
        v-col(cols="11").text-center.pa-0
          video.vjs-big-play-centered(ref="videoPlayer" class="video-js" @timeupdate="timeUpdated" :id="`vexflow-video-${lesson.id}`")
      
      v-row(v-if="melody[0] != ''")
        v-col(cols="12")
          .display-1 The score
        v-col(cols="12")
          div(:id="'vexflow-wrapper-' + lesson.id"  @click="enable_save_btn")

      //- v-row(v-if="!is_student")
      //-   v-col
      //-     v-btn.mt-5(x-large light :disabled="disable" @click="update_rhythms" :loading="save_btn_loading")
      //-       v-icon(left dark) mdi-content-save-all-outline
      //-       | Save Lesson
      //-   v-col
      //-     v-btn.mt-5(x-large light :disabled="disable" @click="update_rhythms" :loading="save_btn_loading")
      //-       v-icon(left dark) mdi-content-save-all-outline
      //-       | Edit Lesson

    v-row.justify-center(v-if="user.isStudent")
      v-col.text-left(cols="11")
        h1.pl-4 Discussion
      //- v-col.text-left(cols="11")
      //-   v-btn(large color="red darken-3" dark @click="dialog = true" v-if="!is_student") Reply to your student
      //-   v-btn(large color="red darken-3" dark @click="dialog = true" v-else) Submit your playing!
      //- v-col(cols="11" v-if="is_student")
      //-   v-expansion-panels(v-if="lesson.thread")
      //-     v-expansion-panel(v-for='(post, i) in lesson.thread.posts' :key='post.id')
      //-       v-expansion-panel-header {{ new Date(post.createdAt).toLocaleString() }}
      //-       v-expansion-panel-content
      //-         | {{ post.message }}
      v-col(cols="11" v-if="lesson.thread")
        v-list(v-if="lesson.thread.posts")
          v-list-item(v-for='(post, idx) in lesson.thread.posts' :key='post.id')
            v-list-item-content.pb-0
              v-container.pt-0.pb-4.px-0(fluid)
                v-row.py-0(v-if="idx == 0 || post.updatedAt.substring(0, 10) != lesson.thread.posts[idx - 1].updatedAt.substring(0, 10)")
                  v-col.py-0
                    v-chip(label color="indigo darken-3" dark style="font-size: 12px;") {{ new Date(post.updatedAt).toLocaleString([], { year: 'numeric', month: 'numeric', day:'numeric'}) }}
                v-row.mt-5
                  v-col.pb-0(style="margin-bottom: -3px;")
                    video(width="100%" height="audo" controls)
                      source(:src="post.videoUrl" type="video/mp4")
                      | Your browser does not support HTML video.

                v-row.justify-end.bottom-border.mx-0.py-3(v-if="post.UserId != user.id")
                  v-col.pr-8.py-0(cols="6") 
                    .speech-bubble-other
                      v-row.ma-0(style="width: 100%;")
                        v-col.text-left
                          div {{ post.message }}
                      .timestamp {{ new Date(post.updatedAt).toLocaleString([], { hour: '2-digit', minute:'2-digit'}) }}
                  v-col.pa-0(cols="1")
                    v-avatar(color='indigo' size="40")
                      v-img(:src="avatar")
                v-row.justify-start.bottom-border.mx-0.py-3(v-else)
                  v-col.pa-0(cols="1")
                    v-avatar(color='indigo' size="40")
                      v-img(:src="avatar")
                  v-col.pl-8.py-0(cols="6") 
                    .speech-bubble-self
                      v-row.ma-0(style="width: 100%;")
                        v-col.text-left
                          div {{ post.message }}
                      .timestamp {{ new Date(post.updatedAt).toLocaleString([], { hour: '2-digit', minute:'2-digit'}) }}
        v-row.justify-center
          v-col(cols="10")
            v-form(:ref="`form`")
              v-row
                v-col(cols="12")
                  v-textarea(outlined name='input-7-4' label='Any question for your tutor?' v-model="message")
                v-col(cols="6")
                  v-file-input(
                    accept="video/mp4, video/ogg" 
                    placeholder="Upload" 
                    prepend-icon="mdi-video"
                    label="Upload Video"
                    v-model="file")

              v-row
                v-col
                  v-btn(large color="#ec5252" dark @click="create_post") Submit practice video
    
    v-row.bpm-control.pt-2(:id="`slider-${lesson.id}`" :class="{ hide: userinactive }")
      v-icon(color="white" large) $vuetify.icons.custom_bpm
      v-slider.pb-2(min="20" max="180" vertical color="white" track-color="rgba(115, 133, 159, 0.5)" thumb-label="always" v-model="playbackBpm")
    
    //- v-row(justify='center')
      v-dialog(v-model='dialog' persistent max-width='600px')
        template(v-slot:activator='{ on, attrs }')
        v-card
          v-card-title
            span.headline Message
          v-card-text.py-0
            v-form(ref="studentform" v-if="is_student")
              v-container
                v-row
                  v-col(cols='12')
                    v-text-field(v-model="message" type="text" label='Message*' required)
                  v-col(cols="12")                          
                    v-file-input(
                      accept="video/mp4, video/ogg" 
                      placeholder="Upload" 
                      prepend-icon="mdi-video"
                      label="Practice Video"
                      v-model="file")
            v-form(ref="tutorform" v-else)
              v-container
                v-row
                  v-col(cols='12')
                    v-text-field(v-model="message" type="text" label='Message*' required)
                  v-col(cols='12')
                    v-subheader.pl-0 Grade
                    v-slider(v-model="grade" min='0' max='100' thumb-label :thumb-size="24")
                  v-col(cols="12")                          
                    v-file-input(
                      accept="video/mp4, video/ogg" 
                      placeholder="Feedback" 
                      prepend-icon="mdi-video"
                      label="Feedback Video"
                      v-model="file")
          v-card-actions
            v-spacer
            v-btn(color='indigo' text @click='dialog = false') Close
            v-btn(color='indigo' text @click="student_create_post") Save
          v-card-text(v-if="error")
            p {{ error }}  
</template>

<script>
/* eslint-disable */
import tone from "@/plugins/tone";
import vexUI from "@/plugins/vex";
import { mapState } from "vuex";
import utils from "@/utils";
import videojs from "video.js";
import PostService from "@/services/PostService"
import "videojs-hotkeys"
import axios from "axios"
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay"

export default {
  name: 'ShowLesson',
  props: ['lesson'],
  data () {
    return {
      numberOfBars: 4,
      bpm: 60,
      timeSignature: '',
      playbackBpm: 0,
      handler: {},
      disable: true,
      save_btn_loading: false,
      add_btn_loading: false,
      description: '',
      melody: [],
      videoHandler: null,
      hide: true,
      notesInBars: null,
      timePerTwoBars: 0,
      demoStartTime: 0,
      currentDisplayedBar: null,
      thread: null,
      dialog: false,
      requiredRules: [
        v => !!v || "This field is required"
      ],
      message: '',
      file: null,
      grade: '',
      avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
      error: null,
      userinactive: true,
      osmd: null,
      from: 1,
      to: 2
    }
  },
  watch: {
    bpm: function (val) {
      this.bpm_label = "BPM: " + val;
    },
    no_bars: function (val) {
      this.bars_label = "No. Bars: " + val;
    },
    playbackBpm: function (val) {
      this.player.playbackRate(val / this.bpm)
    }
  },
  computed: {
    tutor () {
      if (this.user.isStudent)
        return this.$store.getters.tutorFromSubscribedTutors;
      else 
        return null;
    },

    is_student () {
      return this.user.isStudent;
    },

    ...mapState(["user", "students", "subscribedTutors"])
  },
  methods: {
    timeUpdated (event) {
      if (this.notesInBars) {
        if (this.currentDisplayedBar == null) {
          if ((event.target.currentTime - this.demoStartTime) / this.timePerTwoBars >= 0) {
            this.currentDisplayedBar = 0
            this.videoHandler.importNotes(this.notesInBars[0].concat(this.notesInBars[1]), this.timeSignature)
          } else {
            return
          }
        }

        if ((event.target.currentTime - this.demoStartTime) / this.timePerTwoBars - this.currentDisplayedBar >= 1) {
          var currBar = Math.floor((event.target.currentTime - this.demoStartTime) / this.timePerTwoBars)
          if (currBar >= this.notesInBars.length / 2)
            return
          this.currentDisplayedBar = currBar
          this.videoHandler.importNotes(this.notesInBars[currBar * 2].concat(this.notesInBars[currBar * 2 + 1]), this.timeSignature)
          return
        }
        if ((event.target.currentTime - this.demoStartTime) / this.timePerTwoBars < this.currentDisplayedBar) {
          var currBar1 = Math.floor((event.target.currentTime - this.demoStartTime) / this.timePerTwoBars)
          if (currBar1 < 0)
            return
          this.currentDisplayedBar = currBar1
          this.videoHandler.importNotes(this.notesInBars[currBar1 * 2].concat(this.notesInBars[currBar1 * 2 + 1]), this.timeSignature)
        }
      }
    },

    async update_rhythms () {
      this.save_btn_loading = true;
      var oldRhythmIdx = this.lesson.rhythms.indexOf(this.active_rhythm);
      // console.log("oldRhythmIdx", oldRhythmIdx)
      var newRhythm = {
        id: this.active_rhythm.id,
        title: this.active_rhythm_title,
        timeSignature: this.time_signature,
        noOfBars: this.no_bars,
        bpm: this.bpm,
        rhythm: this.handler.exportNotes()
      }

      var newLesson = utils.cloneLesson(this.lesson);
      newLesson.rhythms[oldRhythmIdx] = newRhythm;
      newLesson.rhythms = utils.generateRhythmsString(newLesson.rhythms);
      await this.$store.dispatch("editRhythm", {
        lesson: this.lesson,
        newLesson: newLesson
      });
      this.save_btn_loading = false;
      this.display_rhythm({}, this.lesson.rhythms[oldRhythmIdx]);
    },

    enable_save_btn () {
      this.disable = false;
    },

    async create_post () {
      if (this.$refs.form.validate()) {
        var formData = new FormData()
        formData.set('tid', this.lesson.thread.id)
        formData.set('message', this.message)
        formData.set('grade', this.grade)
        formData.append('video', this.file)
        const response = await PostService.create(formData)
        this.lesson.thread.posts.splice(this.lesson.thread.posts.length, 0, response.data.post)
        this.message = ''
        this.file = null
      } else {
        return
      }
    },

    async changeBars () {
      // this.from += 2
      // this.to += 2
      // this.osmd.setOptions({
      //   drawFromMeasureNumber: this.from,
      //   drawUpToMeasureNumber: this.to
      // })
      // var score = document.getElementById(`video-score-${this.lesson.id}`)
      // score.style.top = `${(this.osmd.graphic.musicPages[0].boundingBox.borderMarginTop - this.osmd.graphic.musicPages[0].boundingBox.boundingMarginRectangle.y) * 10 * -1}px`
      // console.log('top', score.style.top)
      // await this.osmd.render()
      // console.log(this.osmd.graphic)
      // console.log(this.osmd.graphic.musicPages[0].boundingBox)

      // console.log(this.osmd.GraphicSheet.measureList.map(measure => measure[0].boundingBox))
    },

    async drawOsmdScores () {
      var background = document.createElement("div")
      background.setAttribute('id', `video-vexflow-background${this.lesson.id}`)
      background.style.position = "absolute";
      background.style.background = "#FAFAFA";
      background.style.top = "0";
      background.style.left = "0";
      background.style.right = "0";
      background.style.height = "130px";
      background.style.overflow = "hidden"

      var scoreWrapper = document.createElement("div")
      scoreWrapper.setAttribute('id', `video-scoreWrapper-${this.lesson.id}`)
      // scoreWrapper.style.position = "absolute";
      scoreWrapper.style.top = "0";
      scoreWrapper.style.left = "0";

      var score = document.createElement('div')
      score.style.width = "100%"
      score.style.height = "220px"
      background.appendChild(scoreWrapper)
      scoreWrapper.appendChild(score)

      this.osmd = new OpenSheetMusicDisplay(
        score, 
        {
          drawFromMeasureNumber: 1,
          drawUpToMeasureNumber: 2,
          drawComposer: false,
          drawTitle: false,
          renderSingleHorizontalStaffline: true,
          drawPartNames: false,
          autoResize: false,
          drawMetronomeMarks: false,
          // backend: 'Canvas',
          drawingParameters: 'compacttight'
        }
      )
      let scoreXml = await axios.get("https://rhythm-academy.s3-ap-southeast-1.amazonaws.com/twinkle-twinkle-little-star.musicxml");    
      // let scoreXml = await axios.get("https://opensheetmusicdisplay.github.io/demo/sheets/MuzioClementi_SonatinaOpus36No3_Part1.xml");

      await this.osmd.load(scoreXml.data);
      await this.$nextTick();
      // this.osmd.zoom = 1.3
      // this.osmd.setCustomPageFormat(1, .3)
      // await this.osmd.preCalculate();
      // score.style.top = `${(this.osmd.graphic.musicPages[0].boundingBox.borderMarginTop + this.osmd.graphic.musicPages[0].boundingBox.absolutePosition.y) * 10 * -1}px`
      // console.log('top', score.style.top)
      await this.osmd.render();
      console.log(this.osmd.graphic)
      console.log(this.osmd.graphic.musicPages[0].musicSystem)
      console.log(this.osmd)
      // console.log(this.osmd.graphic)
    },

    drawScores (isRedraw) {
      // TODO implement this
      if (isRedraw) {
        const score = document.getElementById(`video-vexflow-wrapper${this.lesson.id}`)
        while (score.firstChild) {
          score.removeChild(score.lastChild);
        }
        const videoScore = document.getElementById(`vexflow-wrapper-${this.lesson.id}`)
        while (videoScore.firstChild) {
          videoScore.removeChild(videoScore.lastChild);
        }
      }
      if (this.user.isStudent) {
        this.handler = new vexUI.Handler(`vexflow-wrapper-${this.lesson.id}`, {
          numberOfStaves: parseInt(this.lesson.exercises[0].numberOfBars),
          canEdit: false
        }).init();
      } else {
        this.handler = new vexUI.Handler(`vexflow-wrapper-${this.lesson.id}`, {
          numberOfStaves: parseInt(this.lesson.exercises[0].numberOfBars)
        }).init();
      }
      this.handler.importNotes(this.melody, this.timeSignature)
      this.notesInBars = this.handler.notesToBars(this.melody, this.timeSignature)

      var wrapper = document.createElement("div")
      wrapper.setAttribute('id', `video-vexflow-wrapper${this.lesson.id}`)
      wrapper.style.position = "absolute";
      wrapper.style.background = "#FAFAFA";
      wrapper.style.top = "0";
      wrapper.style.left = "0";
      wrapper.style.right = "0";
      this.videoHandler = new vexUI.Handler(`video-vexflow-wrapper${this.lesson.id}`, {
        canEdit: false,
        numberOfStaves: 2,
        lessStaveHeight: true,
        canvasProperties: {
          id: `video-vexflow-wrapper${this.lesson.id}` + "-canvas",
          width: this.$refs.videoPlayer.offsetWidth,
          height: 80 * vexUI.scale,
          tabindex: 1
        }
      }, wrapper).init();

      document.getElementById(`vexflow-video-${this.lesson.id}`).appendChild(wrapper)
      document.getElementById(`vexflow-video-${this.lesson.id}`).appendChild(document.getElementById(`slider-${this.lesson.id}`))
    }
  },

  mounted: function () {
    OpenSheetMusicDisplay.prototype.preCalculate = function () {
      if (!this.graphic) {
          throw new Error("OpenSheetMusicDisplay: Before rendering a music sheet, please load a MusicXML file");
      }
      if (this.drawer) {
          this.drawer.clear(); // clear canvas before setting width
      }

      let width = this.container.offsetWidth;
      if (this.rules.RenderSingleHorizontalStaffline) {
          width = 32767; // set safe maximum (browser limit), will be reduced later
          // reduced later in MusicSheetCalculator.calculatePageLabels (sets sheet.pageWidth to page.PositionAndShape.Size.width before labels)
          // rough calculation:
          // width = 600 * this.sheet.SourceMeasures.length;
      }
      console.log("[OSMD] render width: " + width);

      this.sheet.pageWidth = width / this.zoom / 10.0;
      if (this.rules.PageFormat && !this.rules.PageFormat.IsUndefined) {
          this.rules.PageHeight = this.sheet.pageWidth / this.rules.PageFormat.aspectRatio;
          console.log("[OSMD] PageHeight: " + this.rules.PageHeight);
      } else {
          console.log("[OSMD] endless/undefined pageformat, id: " + this.rules.PageFormat.idString);
          this.rules.PageHeight = 100001; // infinite page height // TODO maybe Number.MAX_VALUE or Math.pow(10, 20)?
      }

      // Before introducing the following optimization (maybe irrelevant), tests
      // have to be modified to ensure that width is > 0 when executed
      //if (isNaN(width) || width === 0) {
      //    return;
      //}

      // Calculate again
      this.graphic.reCalculate();
    }
    // const paymentEl = document.getElementById('card-element')
    this.$on("play_sequence", () => {
      tone.init();
      // TODO disable edit when playing
      // this.handler.disableEdit();
      tone.playSequence(this.time_signature, this.bpm, this.handler.exportNotes(), parseInt(this.numberOfBars) + 1, this.handler);
      // this.handler.enableEdit();
    });

    const player = videojs(this.$refs.videoPlayer, {
        controls: true,
        fluid: true,
        sources: [
          {
            src: this.lesson.exercises[0].demoUrl,
            type: "video/mp4"
          }
        ],
        playbackRates: [0.8, 0.9, 1, 1.1, 1.2]
      }, () => {
        // console.log('onPlayerReady', this)
        player.hotkeys({
          volumeStep: 0.1,
          seekStep: 2,
          enableModifiersForNumbers: false
        })
        player.on('userinactive', () => {
          this.userinactive = true
        })
        player.on('useractive', () => {
          this.userinactive = false
        })
        player.on('play', () => {
          this.userinactive = false
        })
        player.on('ratechange', () => {
          this.playbackBpm = this.bpm * this.player.playbackRate()
        })
    });


    this.player = player

    //window.addEventListener('resize', this.onResize);

    this.melody = this.lesson.exercises[0].melody.split('-')
    this.bpm = parseInt(this.lesson.exercises[0].bpm)
    this.playbackBpm = this.bpm
    this.timeSignature = this.lesson.exercises[0].timeSignature
    if (this.melody[0] != "") {
      // this.drawScores()
      this.drawOsmdScores()
      document.getElementsByClassName("v-slider__track-container")[0].style.width = "5px"
      document.getElementsByClassName("v-slider__thumb-label")[0].style.color = "black"
      document.getElementsByClassName("v-slider__thumb-label")[0].style.boxShadow = "0px 0px 5px black"

      var doit;
      // window.onresize = () => {
      //   clearTimeout(doit)
      //   doit = setTimeout(() => {
      //     this.drawScores(true)
      //   }, 200)
      // }
    }
    this.description = this.lesson.description
    this.demoStartTime = this.lesson.exercises[0].demoStartTime
    this.numberOfBars = parseInt(this.lesson.exercises[0].numberOfBars)

    this.timePerTwoBars = ((parseInt(this.timeSignature.split('/')[0]) / this.bpm) * 60) * 2
  },

  beforeDestroy() {
    if (this.player) {
        this.player.dispose()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 
/* 
bg: #5d646e
slider-bg: #72839d
 */
.hide {
  opacity: 0 !important;
  visibility: hidden !important;
}

.bpm-control {
  background-color: rgba(43, 51, 63, 0.7); 
  position: absolute; 
  bottom: 30px; 
  left: 12px; 
  width: 30px;
  visibility: visible;
  opacity: 1;
  transition: visibility 1000ms, opacity 1000ms;
}

</style>
