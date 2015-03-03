import {Behavior} from 'aurelia-templating';
import {TWO_WAY} from 'aurelia-framework';

export class AiTabsAttachedBehavior {
  static metadata () {
    return Behavior
      .withOptions().and( x => {
          x.withProperty('activeTab', 'tabChanged', 'active-tab', false, TWO_WAY)
          .withProperty('_showTab', 'showTabChanged', 'show-tab')
          .withProperty('_hideTab', 'hideTabChanged', 'hide-tab')
      })
      .syncChildren('links', 'linksChanged', '[tab-ref]')
      .noView()
    ;
  }

  static inject() {
    return [Element]
  }

  constructor (element) {
    this.element = element
    this.linkHandler = this._linkHandler.bind(this);
  }

  get panes () {
    return Array.prototype.slice.call(this.element.querySelectorAll('[ai-tab]'));
  }
  
  get getActiveTab(){
    return this.links && this.links[0].getAttribute('tab-ref');
  }
  
  get activeLink () {
    return this.links.find(x => x.getAttribute('tab-ref') === this.activeTab) || this.links[0];
  }

  get activePane () {
    return this.panes.find(x => x.getAttribute('ai-tab') === this.activeTab) || this.panes[0];
  }
  
  attached () {
    this.activeTab = this.activeTab || this.getActiveTab;
    this.setActiveTab(this.activeLink, true)
  }

  bind () {
    this.element.classList.add('ai-tabs');
    this.bindLinks();
    this.bindPanes();
    this.setBorder();
  }
  
  unbind () {
    this.unbindLinks()
  }
  
  bindLinks () {
    if(!this.links) return
    this.unbindLinks

    this.links.forEach(link => {
      link.addEventListener('click', this.linkHandler, false)
    });
  }
  
  bindPanes(){
    if(!this.panes) {return}
    this.panes.forEach((pane)=>{
      pane.classList.add('tab-pane', 'fade');
    })
    
  }
  
  setActiveTab (newActiveLink, force = false) {
    var activeTab = newActiveLink.getAttribute('tab-ref');
    
    if (force !== true && activeTab == this.activeTab) return;
    this.hideTab();
    this.activeTab = activeTab;
    
    
    this.activeLink &&( this.activeLink.parrent.classList.add('active'))
    
    return activeTab;
  }

  linksChanged () {
    this.bindLinks();
  }

  unbindLinks () {
    if(!this.links) return
    this.links.forEach(link => {
      link.removeEventListener('click', this.linkHandler, false)
    })
  }

  _linkHandler ($event) {
    $event.preventDefault()
    this.setActiveTab($event.target)
  }

  showTab () {
    this.activeLink.classList.add('active')
    this.activePane.classList.add('active', 'in')
  }

  hideTab () {
    this.activeLink.classList.remove('active')
    this.activePane.classList.remove('active', 'in')
  }

  tabChanged (value) {
    this[value ? 'showTab' : 'hideTab']();
    this.updateTabSliderPosition()
    // console.log('tabRefChanged', arguments)
  }

  showTabChanged () {
    // console.log('showTabChanged', arguments)
  }
  

  hideTabChanged () {
    // console.log('hideTabChanged', arguments)
  }
  
  
  setBorder(){
    this.border = this.border || this.element.getElementsByClassName('ai-tab-slider')[0] || this.createBorder()
    var nav = this.element.getElementsByClassName('ai-nav-tabs')[0]
    nav.appendChild(this.border);
    
    this.updateTabSliderPosition();
  }
  createBorder(){
    var border = document.createElement('DIV');
    border.classList.add('ai-tab-slider');
    return border;
  }
  
  updateTabSliderPosition () {

      let sliderWidth = 100 / this.links.length

      this.border.style.width = sliderWidth + 10 + '%';
      this.activeLink&& ( this.border.style.left = this.activeLink.offsetLeft + 'px' )

      setTimeout(()=>{
          this.border.style.width = sliderWidth + '%';
      }, 200)

      // next()

  }
}
