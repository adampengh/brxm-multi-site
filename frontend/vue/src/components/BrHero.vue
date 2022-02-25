<!--
  Copyright 2020 Hippo B.V. (http://www.onehippo.com)

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  -->

<template>
  <div v-if="document" class="" :class="{ 'has-edit-button': page.isPreview() }">
    <br-manage-content-button
      :content="document"
      document-template-query="new-hero-document"
      folder-template-query="new-hero-folder"
      parameter="document"
      root="banners"
      :relative="true"
    />
    <h1 v-if="data.title">{{ data.title }}</h1>
    <picture v-if="desktopImage">
      <source />
      <source />
      <img v-if="desktopImage" :src="desktopImage.getOriginal().getUrl()" :alt="data.title" />
    </picture>
    <div v-if="data.text" v-html="page.rewriteLinks(data.text.value)" />
    <p v-if="link" className="lead">
      <router-link :to="link.getUrl()" class="btn btn-primary btn-lg" role="button">Learn more</router-link>
    </p>
  </div>
</template>

<script lang="ts">
import { ContainerItem, Document, Image, Page } from '@bloomreach/spa-sdk';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  computed: {
    data(this: BrHero) {
      return this.document?.getData<DocumentData>();
    },

    document(this: BrHero) {
      const { document } = this.component.getModels<DocumentModels>();
      return document && this.page.getContent<Document>(document);
    },

    imageCompound(this: BrHero) {
      return this.data?.imageCompound;
    },

    desktopImage(this: BrHero) {
      return this.imageCompound?.desktopImage && this.page.getContent<Image>(this.imageCompound?.desktopImage);
    },

    mobileImage(this: BrHero) {
      return this.imageCompound?.mobileImage && this.page.getContent<Image>(this.imageCompound?.mobileImage);
    },

    link(this: BrHero) {
      return this.data?.link && this.page.getContent<Document>(this.data.link);
    },
  },
  name: 'br-hero',
})
export default class BrHero extends Vue {
  @Prop() component!: ContainerItem;

  @Prop() page!: Page;

  data?: DocumentData;

  document?: Document;

  imageCompound?: ImageCompound;

  link?: Document;
}
</script>
