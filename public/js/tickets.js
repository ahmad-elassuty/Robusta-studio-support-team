// DELETE AJAX
$(document).on('click', "[id$='destroy']", function (e) {
    $.ajaxSetup({
        headers: {'X-CSRF-Token': $('meta[name="_token"]').attr('content')}
    });

    $.ajax({
        url: $(this)[0].dataset["route"],
        type: "delete",
        context: $("#ticket-" + $(this)[0].dataset["id"]),
        success: function (data) {
            this.fadeOut(300, function () {
                $(this).remove();
            });
        },
        error: function (data) {
            console.log("Not Authorized");
        }
    })
})

// SHOW modal AJAX
$(document).on('click', "[id$='show']", function (e) {
    if ($("#show-ticket-modal-" + $(this)[0].dataset["id"]).length == 0) {
        $.ajax({
            url: $(this)[0].dataset["route"],
            type: "get",
            success: function (data) {
                $("#modals").append(data['html']);
                $("#show-ticket-modal-" + data['id']).modal("show");
                $("#comment-form-" + data['id']).submit(function (e) {

                    e.preventDefault();
                    if ($("#comment-form-" + data['id']).find('input[type=text]')
                            .filter(':visible:first').val() == "") {
                        return;
                    }
                    $.ajax({
                        url: this.action,
                        type: "post",
                        data: $(this).serialize(),
                        success: function (data) {
                            $("#ticket-" + data['id'] + "-comments").append(data["html"]);
                            $("#comment-form-" + data['id'])[0].reset();
                        },
                        error: function (data) {
                            //console.log("Not Authorized");
                        }
                    });
                });
            },
            error: function (data) {
                alert("Not Authorized");
            }
        });

    } else {
        $("#show-ticket-modal-" + $(this)[0].dataset["id"]).modal("show");
    }
});

// EDIT Modal AJAX
$(document).on('click', "[id$='edit']", function (e) {
    if ($("#edit-ticket-modal-" + $(this)[0].dataset["id"]).length == 0) {
        $.ajax({
            url: $(this)[0].dataset["route"],
            type: "get",
            success: function (data) {
                $("#modals").append(data['html']);
                $("#edit-ticket-modal-" + data['id']).modal("show");

                $("#ticket-form-" + data['id']).submit(function (e) {
                    e.preventDefault();
                    //discardDefaultSelectTagValue(this.id);
                    $.ajax({
                        url: this.action,
                        type: "put",
                        data: $(this).serialize(),
                        success: function (data) {
                            $("#ticket-" + data['id']).html(data["html"]);
                            $("#edit-ticket-modal-" + data["id"]).modal('hide');

                            if ($("#show-ticket-modal-" + data["id"]).length > 0) {
                                $("#show-ticket-modal-" + data["id"]).remove();
                            }
                            e.preventDefault();
                        },
                        error: function (data) {
                            console.log("Not Authorized");
                        }
                    });
                });
            },
            error: function (data) {
                alert("Not Authorized");
            }
        });
    } else {
        $("#edit-ticket-modal-" + $(this)[0].dataset["id"]).modal("show");
    }
});

$(document).on('click', "[id$='claim']", function (e) {
    $.ajaxSetup({
        headers: {'X-CSRF-Token': $('meta[name="_token"]').attr('content')}
    });

    $.ajax({
        url: $(this)[0].dataset["route"],
        type: "post",
        context: $("#ticket-" + $(this)[0].dataset["id"]),
        success: function (data) {
            this.fadeOut(300, function () {
                $(this).remove();
            });
            e.preventDefault();
        },
        error: function (data) {
            console.log("Not Authorized");
        }
    });
});

//$(window).on('hashchange', function () {
//    if (window.location.hash) {
//        var page = window.location.hash.replace('#', '');
//        if (page == Number.NaN || page <= 0) {
//            return false;
//        } else {
//            getTickets(page);
//        }
//    }
//});
//
$(window).ready(function () {
    console.log('hahah');
    this.pusher = new Pusher('ef9d531d012262441596', {
        cluster: 'eu',
        encrypted: true
    });
    console.log(userID);
    this.pusherChannel = this.pusher.subscribe('user.' + userID);

    this.pusherChannel.bind('ticket-assigned', function(notification) {
        // console.log(notification);
        var notificationsCount = parseInt($('#notifications-counter').html()) | 0;
        notificationsCount++;
        var soundFx = $('#soundFX'); // Get our sound FX.
        soundFx[0].play();
        $('#notifications-counter').html(notificationsCount);
        $(".dropdown ul .menu").prepend(
            `<li>
                <a href="/${notification.url}" style="font-weight: bold;">
                  <i class="fa ${notification.parameters.css_class}"></i>${notification.message}
                </a>
            </li>`);
    });


    $('#notifications-menu').click(function (e) {
        if($(".notifications-menu").hasClass('open')) {
            $(".dropdown ul .menu li a").css('font-weight', 'normal');
            $('#notifications-counter').html("");
        }
        $.ajaxSetup({
            header: $('meta[name="_token"]').attr('content')
        });
        $.ajax({
            type: 'GET',
            url: '/notifications/mark_as_read',
            success: function () {
            },
            error: function () {
                console.log('failed marking notifications as read');
            }
        });
    });
});


//
//function getTickets(page) {
//    $.ajax({
//        url: '?page=' + page,
//        dataType: 'json'
//    }).done(function (data) {
//        $('#tickets-pool').html(data);
//        location.hash = page;
//    }).fail(function () {
//        alert('Tickets could not be loaded.');
//    });
//}
$(function () {
    /// notifications related

    $(document).on('click', '.fa-ticket', function (e) {
        var modal = $("#create-ticket-from-feed-modal");
        modal.find("#customer_twitter_id").val($(this).data('customer-twitter-id'));
        modal.find("#customer_profile_image_path").val($(this).data('customer-profile-image-path'));
        modal.find("#customer_name").val($(this).data('customer-name'));
        modal.find("#tweet_text").val($(this).data('tweet-text').replace('@robusta_team1', ''));
        modal.find("#tweet_id").val($(this).data('tweet-id'));
    });
    $(document).on('click', '.btn-add', function (e) {
        e.preventDefault();
        var controlForm = $('#dynamic-fields');
        var currentEntry = $(this).parents('.entry:first');
        if (currentEntry.find(':selected').val() == -1)
            return;
        var newEntry = $(currentEntry.clone()).appendTo(controlForm);
        newEntry.find('option[value=' + currentEntry.find(':selected').val() + ']').remove();
        if (newEntry.find('option').length == 2) {
            newEntry.find('.btn-add').hide();
        }
        controlForm.find('.entry:not(:last) .btn-add').removeClass('btn-add').addClass('btn-remove').removeClass('btn-success').addClass('btn-danger').html('<span class="glyphicon glyphicon-minus"></span>');


    }).on('click', '.btn-remove', function (e) {
        var deleted = $(this).parents('.entry:first').find(':selected');
        console.log(deleted.val());
        $(this).parents('.entry').nextAll().map(function () {
            $(this).children('select').first().append(deleted);
            $(this).find('.btn-add').show();

        });
        $(this).parents('.entry:first').remove();
        e.preventDefault();
        return false;
    });
    $('.feed').submit(function (e) {
        e.preventDefault();
        var empty = $(this).find('input').filter(function () {
            return $(this).val().length == 0;
        });
        var ticket_button_id = $(this).find('#tweet_id').val();
        if (empty.length == 0) {
            $.ajaxSetup({
                header: $('meta[name="_token"]').attr('content')
            });
            $.ajax({
                type: "POST",
                url: $(this).attr('action'),
                data: $(this).serialize(),
                dataType: 'json',
                success: function () {
                    console.log('#' + ticket_button_id);
                    $('#' + ticket_button_id).prop('disabled', true);
                },
                error: function () {
                    console.log('fail');
                }
            });
            $('#create-ticket-from-feed-modal').modal('toggle');
        } else {
            empty.css('background', '#D43F3A');
        }
    });
    $('.comment-form').submit(function (e) {
        e.preventDefault();
        post = $(this);
        $.ajaxSetup({
            header: $('meta[name="_token"]').attr('content')
        });
        $.ajax({
            type: "POST",
            url: $(this).attr('action'),
            data: $(this).serialize(),
            dataType: 'json',
            success: function () {
                console.log(post.find('#commenter_image').val());
                 $(post).parent().siblings('div.chat').prepend(`
                    <div class="item">
                        <img alt="user image" class="online" src=${post.find('#commenter_image').val() || '/assets/images/user2-160x160.jpg'}>
                        <p class="message">
                            <a href="#" class="name">
                                <small class="text-muted pull-right"><i class="fa fa-clock-o"></i> ${moment(Date.now()).fromNow()}</small>
                                <span class="name">${post.find('#commenter_name').val()}</span>
                            </a>
                            <p class="comment">
                                ${post.find('input.form-control').val()}
                            </p>
                        </p>
                    </div>`)
                // var comments_list = post.parent().parent().find('#chat-box-workspace .item').slice(0, 5);
                // console.log(comments_list);
                // console.log(post);
                // console.debug(post.parent().parent().find('#chat-box-workspace'));
                // post.parent().parent().find('#chat-box-workspace').html(comments_list);
                // post.parent().siblings("#chat-box-workspace").html(comments_list);
                // $('#chat-box-workspace').html(comments_list);
                // post.parent().siblings('div.chat').find('img.online').attr('src', post.find('#commenter_image').val());
                // post.parent().siblings('div.chat').find('span.name').text(post.find('#commenter_name').val());
                // post.parent().siblings('div.chat').find('p.comment').text(post.find('input.form-control').val());
                post.find('input.form-control').val("");
            },
            error: function () {
                alert("request failed");
            }
        });
        return false;
    });
    $(document).on('change', '.department_select_free_agents', function (e) {
        var agents_select = $(this).parents('.box-body').find('.agent_select');
        agents_select.html("<option value=''>Please select a department to load free agents</option>");
        e.preventDefault();
        var department = $(this).val();
        if (department != -1) {
            $.ajaxSetup({
                header: $('meta[name="_token"]').attr('content')
            });
            $.ajax({
                type: "GET",
                url: "/department/free/" + department,
                dataType: 'json',
                success: function (response) {
                    console.log('success')
                    console.log(response);
                    $.each(response['agents'], function (key, value) {
                        agents_select.append($("<option></option>")
                            .attr("value", key)
                            .text(value));
                    });
                },
                error: function (jqxhr) {
                    console.log(jqxhr);
                    alert('failed');
                }
            });
        }
    });
    $('.modal').on('hidden.bs.modal', function (e) {
        $(this).find('form').trigger('reset');
    });
    $('#create-department-modal').on('show.bs.modal', function (e) {
        if ($(this).find('option').length == 1) {
            $.ajaxSetup({
                header: $('meta[name="_token"]').attr('content')
            });
            $.ajax({
                type: "GET",
                url: "/department/supervisor",
                dataType: 'json',
                success: function (response) {
                    $.each(response['supervisors'], function (key, value) {
                        $('#supervisor_select').append($("<option></option>")
                            .attr("value", key)
                            .text(value));
                    });
                },
                error: function (jqxhr) {
                    alert('failed');
                }
            });
        }
    });
    $('#form-add-department').on('submit', function () {
        //.....
        //show some spinner etc to indicate operation in progress
        //.....
        $.ajax({
            url: '/departments',
            type: "post",
            data: {
                "name": $('#department-name').val(),
                "description": $('#department-description').val()
            },
            success: function (data) {
                console.log(data);
                $('.modal').modal('hide');
                window.location.href = '/departments/' + data.slug;
            },
            error: function (err) {
                if (err.responseJSON.errors.description) {
                    $('#descriptionError').css('display', 'block');
                    $('#descriptionError').html(err.responseJSON.errors.description);
                }
                if (err.responseJSON.errors.name) {
                    $('#nameError').css('display', 'block');
                    $('#nameError').html(err.responseJSON.errors.name);
                }
            }
        });
        //prevent the form from actually submitting in browser
        return false;
    });

    $(document).on('show.bs.modal', "[id$='edit']", function (e) {
        alert('hey');
        var agent_select = $(this).find('.agent_select');
        if (agent_select.find('option').length == 1) {
            $.ajaxSetup({
                header: $('meta[name="_token"]').attr('content')
            });
            $.ajax({
                type: "GET",
                url: "/department/free/" + department,
                dataType: 'json',
                success: function (response) {
                    $.each(response['agents'], function (key, value) {
                        agents_select.append($("<option></option>")
                            .attr("value", key)
                            .text(value));
                    });
                },
                error: function (jqxhr) {
                    alert('failed');
                }
            });
        }
    });
});

// Priority
$(document).on('click', "#destroy-priority-index", function(e) {
    $.ajax({
        url: "priorities/" + $(this)[0].dataset['id'],
        type: "delete",
        context: $(this),
        success: function (data) {
            this.fadeOut(300, function () {
                $('#priority-index-' + data['id']).remove();
            });
        },
        error: function (data) {
            alert("error");
        }
    })
});

$(document).on('click', "#edit-priority-index", function(e) {
    if ( $("#edit-priority-index-modal-" + this.dataset['id']).length == 0 ){
        $.ajax({
            url: "priorities/" + $(this)[0].dataset['id'] + '/edit',
            type: "get",
            context: $(this),
            success: function (data) {
                $("#modals").append(data['html']);
                $("#edit-priority-index-modal-" + data['id']).modal("show");
                $("#edit-priority-index-modal-" + data['id'] + ' form').submit(function(e){
                    e.preventDefault();
                    $.ajax({
                        url: $(this)[0].action,
                        type: "put",
                        data: $(this).serialize(),
                        success: function (data) {
                            var id = 'edit-priority-index-modal-' + data['id'];
                            hideModalAfterSuccess(id);
                            $(this).remove();
                            console.log(data["html"]);
                            $("#priority-index-" + data['id']).html(data["html"]) ;
                        },
                        error: function (data) {
                            showModalError('edit-priority-index-modal-' + data.responseJSON['id'], 'errors', data);
                        }
                    });
                });
            },
            error: function (data) {
                alert("error");
            }
        })
    } else {
        $("#edit-priority-index-modal-" + this.dataset['id']).modal("show");
    }
});

$(document).on('submit', '#create-priority-modal', function (e) {
    e.preventDefault();
    $.ajax({
        url: 'priorities',
        type: 'post',
        data: $("#create-priority-modal form").serialize(),
        context: $("#create-priority-modal"),
        success: function (data) {
            hideModalAfterSuccess('create-priority-modal');
        },
        error: function (data) {
            showModalError('create-priority-modal', 'errors', data);
        }
    });
});


// Label
$(document).on('click', "#destroy-label-index", function(e) {
    $.ajax({
        url: "labels/" + $(this)[0].dataset['id'],
        type: "delete",
        context: $(this),
        success: function (data) {
            this.fadeOut(300, function () {
                $('#label-index-' + data['id']).remove();
            });
        },
        error: function (data) {
            alert("error");
        }
    })
});

$(document).on('click', "#edit-label-index", function(e) {
    if ( $("#edit-label-index-modal-" + this.dataset['id']).length == 0 ){
        $.ajax({
            url: "labels/" + $(this)[0].dataset['id'] + '/edit',
            type: "get",
            context: $(this),
            success: function (data) {
                $("#modals").append(data['html']);
                $("#edit-label-index-modal-" + data['id']).modal("show");
                $("#edit-label-index-modal-" + data['id'] + ' form').submit(function(e){
                    e.preventDefault();
                    $.ajax({
                        url: $(this)[0].action,
                        type: "put",
                        data: $(this).serialize(),
                        success: function (data) {
                            var id = 'edit-label-index-modal-' + data['id'];
                            hideModalAfterSuccess(id);
                            $(this).remove();
                            console.log(data["html"]);
                            $("#label-index-" + data['id']).html(data["html"]) ;
                        },
                        error: function (data) {
                            showModalError('edit-label-index-modal-' + data.responseJSON['id'], 'errors', data);
                        }
                    });
                });
            },
            error: function (data) {
                alert("error");
            }
        })
    } else {
        $("#edit-label-index-modal-" + this.dataset['id']).modal("show");
    }
});

$(document).on('submit', '#create-label-modal', function (e) {
    e.preventDefault();
    $.ajax({
        url: 'labels',
        type: 'post',
        data: $("#create-label-modal form").serialize(),
        context: $("#create-label-modal"),
        success: function (data) {
            hideModalAfterSuccess('create-label-modal');
        },
        error: function (data) {
            showModalError('create-label-modal', 'errors', data);
        }
    });
});


// Helper Function
function hideModalAfterSuccess(modalId) {
    $('#' + modalId + ' form')[0].reset();
    $('#' + modalId).modal('hide');
    $('#' + modalId + ' .error').remove();
}


function showModalError(formId, errorArrayName, data) {
    var inputs = $('#' + formId + ' :input[id]');
    var errors = data.responseJSON[errorArrayName];
    $('#' + formId + ' .error').remove();
    $.each( inputs, function( index, value) {
        var errorMsg = "<p class='text-red error' style='width: 79%;margin-left: 19%'>";
        var id = $(value)[0].id;
        if (errors[id]) {
            errorMsg = errorMsg + errors[id] + "</p>"
            $(value).parent().parent().prepend(errorMsg);
        }
    });
}
